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
                data => this.fcm.enviarDatosUsuario(
                    value.nombre, value.apellidos, value.nick, 
                    value.email, value.telefono, data.user.uid),
                err => reject(err))    
        })
    }

    loginUser(value) {
        return new Promise<any>((resolve, reject) => {
            this.firebase.auth.signInWithEmailAndPassword(value.email, value.password)
        .then(
            res => resolve(res),
            err => reject(err))
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