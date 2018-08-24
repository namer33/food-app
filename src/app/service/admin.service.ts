import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { tap, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Admin } from '../models/interface';





@Injectable()
export class AdminService {
  adminsCollection: AngularFirestoreCollection<Admin>;  // สร้างตาราง แล้ว add ข้อมูลทีหลัง (ระบุ uid auto)
  adminDoc: AngularFirestoreDocument<Admin>;  // สร้างตารางพร้อมใส่ข้อมูล แล้วระบุ uid เอง
  admins: Observable<Admin[]>;
  admin: Observable<Admin>;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  isAdmin: boolean;
  isAdmin2: boolean;
  uid: string;
  email: string;
  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public storage: AngularFireStorage
  ) {
    this.adminsCollection = this.afs.collection('admins', ref => ref);
    //// Get auth data, then get firestore admin document || null
    this.admin = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<Admin>(`admins/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
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
          resolve(data.user),  // เข้าระบบ
            this.updateAdminData(data.user, pass);
        }, err => reject(err));
    });
  }


  signIn(email: string, pass: string) {
    this.isAdmin = true;
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(data => {
          const userRef = this.afs.collection('users').ref.where('idUser', '==', data.user.uid);
          userRef.get().then((result) => {
            result.forEach(doc => {
              // ถ้ามีจะทำในส่วนนี้ได้
              // console.log(doc.data());
              console.log(doc.id);
              this.isAdmin = false;
            });
            if (this.isAdmin) {
              console.log('OK admin!');
              this.updateAdminData(data.user, pass);
              resolve(data);
            } else {
              console.log('no admin!');
              reject('No Admin!');
            }
          });
        }, err => reject(err));
    });
  }

  getAuth() {
    return this.afAuth.authState.map(auth => auth);
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }

  authDelete(email: string, pass: string) {
    console.log('authDelete: ' + email);
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(data => {
          console.log('authDelete-yes user!');
          // tslint:disable-next-line:prefer-const
          let user = data.user.email;
          console.log('data.user.email: ' + user);
          data.user.delete();
          resolve(data);
        }, err => reject(err));
    });
  }


  authUpdate(update: Admin, email: string, pass: string) {
    console.log('authUpdate: ' + email);
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(data => {
          console.log('authUpdate-yes user!');
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

  getAllAdmins(): Observable<Admin[]> {
    this.admins = this.adminsCollection.snapshotChanges()
      .map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Admin;
          data.idAdmin = action.payload.doc.id;
          return data;
        });
      });
    return this.admins;
  }


  getOneAdmin(id: string) {
    // console.log(id);
    this.adminDoc = this.afs.doc<Admin>(`admins/${id}`);
    this.admin = this.adminDoc.snapshotChanges().map(action => {
      if (action.payload.exists === false) {
        console.log('no');
        return null;

      } else {
        console.log('y');
        const data = action.payload.data() as Admin;
        data.idAdmin = action.payload.id;
        return data;
      }
    });
    return this.admin;
  }


  reSignInAdmins() {
    console.log('reSignInAdmins: ' + this.uid);
    return this.afs.collection('admins').ref.where('idAdmin', '==', this.uid)
      .get()
      .then((result) => {
        result.forEach(doc => {
          // ถ้ามีจะทำในส่วนนี้ได้
          // console.log(doc.id);
          // tslint:disable-next-line:prefer-const
          let data = doc.data();
          this.signIn(data.email, data.password);
        });
      }).catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }


  private updateAdminData(user, pass) {
    this.isAdmin2 = false;
    const aRef = this.afs.collection('admins').ref.where('idAdmin', '==', user.uid);
    aRef.get().then((ref) => {
      ref.forEach(doc => {
        // tslint:disable-next-line:prefer-const
        this.isAdmin2 = true;
      });
      if (this.isAdmin2) {
        return;
      } else {
        console.log('5555');
        // Sets admin data to firestore on login
        const adminRef: AngularFirestoreDocument<Admin> = this.afs.doc(`admins/${user.uid}`);
        const data: Admin = {
          idAdmin: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          password: pass,
          fname: '',
          lname: '',
          address: '',
          tel: null,
          date_Signup: '',
        };
        return adminRef.set(data, { merge: true });
      }
    });
  }


  updateAdmin(admin: Admin) {
    this.adminDoc = this.afs.doc(`admins/${admin.idAdmin}`);
    this.adminDoc.update(admin);
  }


  deleteAdmin(value: Admin) {
    return new Promise((resolve, reject) => {
      this.adminDoc = this.afs.doc(`admins/${value.idAdmin}`);
      this.adminDoc.delete()
        .then(() => {
          this.authDelete(value.email, value.password)
            .then(() => {
              this.reSignInAdmins()
                .then(() => {
                  this.delFile(value.photoName);
                  resolve();
                });
            });
        });
    });
  }
  // =================== Database =================


  // =================== Storage =================


  delFile(fileNmae) {
    console.log('fileNmae: ', fileNmae);
    if (fileNmae) {
      const fileRef = this.storage.ref(fileNmae);
      fileRef.delete()
        .subscribe(() => {
          console.log('ok!');
        });
    }
  }


  uploadFile(file, value: Admin) {
    const fileName = value.photoName;
    // console.log('fireName-7777:', value.photoName);
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    const filePath = `adminPic/${new Date().getTime()}_${file.name}`;
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
              value.photoName = filePath;
              console.log(`filePath: ${filePath}`);
              this.updateAdmin(value);
              this.delFile(fileName);
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

    const userRef = this.afs.collection('admins').ref.where('uid', '==', data.user.uid);
    userRef.get().then((result) => {
      result.forEach(doc => {
        console.log(doc.data());
        // added benefit of getting the document id / key
        console.log(doc.id);
      });
    });

  */
}
