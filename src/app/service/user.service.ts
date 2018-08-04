import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { tap, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '../models/interface';



@Injectable()
export class UserService {
  usersCollection: AngularFirestoreCollection<User>;  // สร้างตาราง แล้ว add ข้อมูลทีหลัง (ระบุ uid auto)
  userDoc: AngularFirestoreDocument<User>;  // สร้างตารางพร้อมใส่ข้อมูล แล้วระบุ uid เอง
  users: Observable<User[]>;
  user: Observable<User>;
  percentage: Observable<number>;
  snapshot: Observable<any>;

  authState: any;
  uid: string;
  isUser = false;
  nn;
  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public storage: AngularFireStorage
  ) {
    this.usersCollection = this.afs.collection('users', ref => ref);
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.userState();
  }


  //  เช็กสถานะการล็อกอิน
  userState() {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      if (this.authState) {
        console.log('++this.auth: ' + JSON.stringify(this.authState.email));
      }
    });
  }


  // =================== Auth =================

  getUid() {
    // tslint:disable-next-line:prefer-const
    let id = this.afAuth.auth.currentUser.uid;
    console.log('id: ' + id);
    this.addUid(id);
  }


  signUp(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
        .then(data => {
          resolve(data.user),
            this.updateUserData(data.user, pass);
        }, err => reject(err));
    });
  }


  signIn(email: string, pass: string) {
    console.log('signin: ' + email);
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(data => {
          console.log('yes user!');
          resolve(data);  // เข้าระบบตรงนี้   // กรณี login สำเร็จ
          this.removeUidAll();
        }, err => reject(err));
    });
  }


  getAuth() {
    return this.afAuth.authState.map(auth => auth);
  }

  signOut() {
    console.log('signOut');
    return this.afAuth.auth.signOut();
  }


  authUserDelete(email: string, pass: string) {
    console.log('authUserDelete: ' + email);
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(data => {
          console.log('authUserDelete-yes user!');
          // tslint:disable-next-line:prefer-const
          let user = data.user.email;
          console.log('data.user.email: ' + user);
          data.user.delete();
          resolve(data);
        }, err => reject(err));
    });
  }


  authUserUpdate(update: User, email: string, pass: string) {
    console.log('authUserUpdate: ' + email);
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(data => {
          console.log('authUserUpdate-yes user!');
          // tslint:disable-next-line:prefer-const
          let user = data.user.email;
          console.log('data.user.email: ' + user);
          console.log('update.email: ' + update.email);
          data.user.updateEmail(update.email)
            .then(() => {
             // re password---->
              resolve();
            }).catch((error) => {
              reject(error);
            });
        }, err => reject(err));
    });
  }


  // =================== Auth =================




  // =================== Database =================

  getAllUsers(): Observable<User[]> {
    this.users = this.usersCollection.snapshotChanges()
      .map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as User;
          return data;
        });
      });
    return this.users;
  }


  getOneUser(id: string) {
  //  console.log(id);
    this.userDoc = this.afs.doc<User>(`users/${id}`);
    this.user = this.userDoc.snapshotChanges().map(action => {
      if (action.payload.exists === false) {
        console.log('no');
        return null;

      } else {
        console.log('y');
        const data = action.payload.data() as User;
        data.idUser = action.payload.id;
        return data;
      }
    });
    return this.user;
  }


  reSignInAdmins() {
    console.log('reSignInAdmins: ' + this.uid);
    return this.afs.collection('admins').ref.where('idAdmin', '==', this.uid)
      .get()
      .then((result) => {
        result.forEach(doc => {
          // ถ้ามีจะทำในส่วนนี้ได้
          //      console.log('doc: ' + doc.data());
          // console.log(doc.id);
          // tslint:disable-next-line:prefer-const
          let data = doc.data();
          this.signIn(data.email, data.password);
        });
      }).catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }



  private updateUserData(user, pass) {
    // Sets user data to firestore on login
    this.userDoc = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      idUser: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      password: pass,
      fname: '',
      lname: '',
      address: '',
      tel: null,
      date_Signup: '',
      landmarks: ''
    };
    this.userDoc.set(data, { merge: true });
  }


  addUser(value) {
    console.log('addUser: ' + value.email);
    this.usersCollection.add(value);
    this.getAllUsers();
  }

  updateUser(user: User) {
    console.log('updateUser: ' + user.idUser);
    this.userDoc = this.afs.doc(`users/${user.idUser}`);
    this.userDoc.update(user);
  }

  deleteUser(id) {
    console.log('id: ' + id);
    this.userDoc = this.afs.doc(`users/${id}`);
    this.userDoc.delete();
  }



  // =================== Database =================


  // =================== Storage =================


  uploadFile(file, value) {
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    const filePath = `userPic/${new Date().getTime()}_${file.name}`;
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
          //     console.log(snap);
          if (snap.bytesTransferred === snap.totalBytes) {
            fileRef.getDownloadURL().subscribe(ref => {
              //       console.log('REF', ref);
              value.photoURL = ref;
              console.log(`image: ${value.photoURL}`);
              this.updateUser(value);
              resolve();
            });
          }
        }),
      );
      this.snapshot.subscribe();
    });
  }
  // =================== Storage =================



  // =================== localStorage =================
  addUid(id) {
    localStorage.setItem('uid', id);
    this.loadUid();
  }

  loadUid(): void {
    this.uid = localStorage.getItem('uid');
    //   console.log(this.uid);
  }

  removeUidAll() {
    this.uid = null;
    localStorage.setItem('uid', '');
  }
  // =================== localStorage =================




  /*

    const userRef = this.afs.collection('users').ref.where('uid', '==', data.user.uid);
    userRef.get().then((result) => {
      result.forEach(doc => {
        console.log(doc.data());
        // added benefit of getting the document id / key
        console.log(doc.id);
      });
    });

  */

}
