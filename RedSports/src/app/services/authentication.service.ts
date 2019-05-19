import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { FcmService } from './fcm.service';

@Injectable()
export class AuthenticateService {

    constructor(
        private firebase:AngularFireAuth,
        private database: AngularFireDatabase,
        private fcm: FcmService
    ) {}

    registerUser(value) {
        return new Promise<any>((resolve, reject) => {
            this.firebase.auth.createUserWithEmailAndPassword(value.email, value.password)
            .then(
                data => {
                    let node = this.database.database.ref('users/')
                    node.update({ 
                        [data.user.uid]: {
                            "nombre": value.nombre,
                            "apellidos": value.apellidos,
                            "nick": value.nick,
                            "email": value.email,
                            "telefono": value.telefono,
                            "token": this.fcm.getToken(false)
                        }
                    }).then(
                        res => resolve(res),
                        err => reject(err)  
                    )
                })
        })
    }

    loginUser(value) {
        return new Promise<any>((resolve, reject) => {
            this.firebase.auth.signInWithEmailAndPassword(value.email, value.password)
        .then( data => {
             let nodo = this.database.database.ref('users/'+data.user.uid+"/token/");
             nodo.set(this.fcm.getToken(false)).then(
                res => resolve(res),
                err => reject(err)
             );
            })
        })
    }

    logoutUser() {
        return new Promise((resolve, reject) => {
            if(this.firebase.auth.currentUser) {
                this.firebase.auth.signOut()
                .then(() => {
                    resolve()
                }).catch((error) => {
                    reject()
                })
            }
        })
    }
}