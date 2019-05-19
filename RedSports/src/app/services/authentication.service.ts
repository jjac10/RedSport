import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable()
export class AuthenticateService {

    constructor(public firebase:AngularFireAuth) {}

    registerUser(value) {
        return new Promise<any>((resolve, reject) => {
        this.firebase.auth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
            res => resolve(res),
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
                    console.log("Ha cerrado sesión")
                    resolve()
                }).catch((error) => {
                    reject()
                })
            }
        })
    }
}