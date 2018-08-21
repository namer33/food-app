import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Food, Category } from '../models/interface';




@Injectable()
export class FoodService {
  foodsCollection: AngularFirestoreCollection<Food>;
  foodDoc: AngularFirestoreDocument<Food>;
  foods: Observable<Food[]>;
  food: Observable<Food>;

  categorysCollection: AngularFirestoreCollection<Category>;
  categoryDoc: AngularFirestoreDocument<Category>;
  categorys: Observable<Category[]>;
  category: Observable<Category>;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  isFood: any[];
  foodBy: Food[] = [];
  constructor(
    private storage: AngularFireStorage,
    public afs: AngularFirestore) {
    this.foodsCollection = this.afs.collection('foods', ref => ref);
    this.categorysCollection = this.afs.collection('categorys', ref => ref);
  }


  _foodBy(value) {
    this.foodBy = [];
    // เรียงจากน้อยไปมาก
    if (value === 'desc') {
      console.log('_foodBy: desc');
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise((resolve) => {
        this.afs.collection('foods').ref.orderBy('date', 'desc')
          .get()
          .then((result) => {
            result.forEach((doc) => {
              const data = doc.data() as Food;
              //   console.log('date: ', data.date);
              this.foodBy.push(data);
            });
            resolve();
          }).catch(function (error) {
            console.log('Error getting documents: ', error);
          });
      });
    }
    // เรียงจากมากไปน้อย
    if (value === 'asc') {
      console.log('_foodBy: asc');
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise((resolve) => {
        this.afs.collection('foods').ref.orderBy('date', 'asc')
          .get()
          .then((result) => {
            result.forEach((doc) => {
              const data = doc.data() as Food;
              //   console.log('date: ', data.date);
              this.foodBy.push(data);
            });
            resolve();
          }).catch(function (error) {
            console.log('Error getting documents: ', error);
          });
      });
    }
  }


  // getAllCategorys
  getAllCategorys(): Observable<Category[]> {
    this.categorys = this.categorysCollection.snapshotChanges()
      .map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Category;
          return data;
        });
      });
    return this.categorys;
  }



  getAllFoods(): Observable<Food[]> {
    this.foods = this.foodsCollection.snapshotChanges()
      .map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Food;
          data.idFood = action.payload.doc.id;
          //    data.date = time
          this.updateFood(data);  // add id
          return data;
        });
      });
    return this.foods;
  }


  getOneFood(idFood: string) {
    this.foodDoc = this.afs.doc<Food>(`foods/${idFood}`);
    this.food = this.foodDoc.snapshotChanges().map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Food;
        data.idFood = action.payload.id;
        return data;
      }
    });
    return this.food;
  }


  addFood(value) {
    console.log('s-adfood: ' + value.name);
    this.foodsCollection.add(value);
    this.getAllFoods();
  }


  updateFood(food: Food) {
    this.foodDoc = this.afs.doc(`foods/${food.idFood}`);
    this.foodDoc.update(food);
  }

  deleteFood(id) {
    console.log('delFood');
    this.foodDoc = this.afs.doc(`foods/${id}`);
    //   console.error(`foods/${food.id}`);
    // return;
    this.foodDoc.delete();
  }


  uploadFile(update: Boolean, file, value) {
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    const filePath = `foodPic/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const customMetadata = { app: 'My AngularFire-powered PWA!' };
    const task = this.storage.upload(filePath, file, { customMetadata });

    // observe percentage changes
    this.percentage = task.percentageChanges();
    // console.log('66_percentage :( ' + this.percentage);
    // get notified when the download URL is available
    return new Promise((resolve, reject) => {
      this.snapshot = task.snapshotChanges().pipe(
        tap(snap => {
          console.log(snap);
          if (snap.bytesTransferred === snap.totalBytes) {
            fileRef.getDownloadURL().subscribe(ref => {
              //       console.log('REF', ref);
              value.imageUrl = ref;
              console.log(`image: ${value.imageUrl}`);
              if (update) {
                this.updateFood(value);
                console.log(`updateFood`);
                resolve();
              } else {
                this.addFood(value);
                console.log('addFood' + value.name);
                resolve();
              }
            });
          }
        }),
      );
      this.snapshot.subscribe();
    });
  }

  // pomosion page หาเมนูอาหารแนะนำ
  getNameFood(name: string) {
    console.log('getNameFood');
    // tslint:disable-next-line:prefer-const
    let nameRef = this.afs.collection('foods').ref.where('name', '==', name);
    nameRef.get().then((result) => {
      result.forEach(doc => {
        // ถ้ามีจะทำในส่วนนี้ได้
        // console.log(doc.data());
        console.log(doc.id);
        // tslint:disable-next-line:prefer-const
        let data = doc.data() as Food;
        console.log(data.idFood);
        this.addF(data);
      });
    });
  }


  // localStorage
  addF(value: Food) {
    if (value) {
      console.log('addFood');
      if (localStorage.getItem('foods') == null) {
        const foods: any = [];
        foods.push(JSON.stringify(value));
        localStorage.setItem('foods', JSON.stringify(foods));
      } else {
        const foods: any = JSON.parse(localStorage.getItem('foods'));
        for (let i = 0; i < foods.length; i++) {
          // tslint:disable-next-line:prefer-const
          // tslint:disable-next-line:no-shadowed-variable
          const food: any = JSON.parse(foods[i]);
          if (food.id === value.idFood) {
            return true;
          }
        }
        foods.push(JSON.stringify(value));
        localStorage.setItem('foods', JSON.stringify(foods));
      }
    }
    this.loadFood();
  }


  loadFood(): void {
    this.isFood = [];
    const foods = JSON.parse(localStorage.getItem('foods'));
    if (foods) {
      for (let i = 0; i < foods.length; i++) {
        const food: Food = JSON.parse(foods[i]);
        this.isFood.push({
          idFood: food.idFood,
          name: food.name,
          imageUrl: food.imageUrl,
          price: food.price,
          status: food.status
        });
      }
    }
    //  console.log('this.total: ' + this.total);
  }

}
