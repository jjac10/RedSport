import { Injectable } from '@angular/core';
import { KnownPlatform } from 'ionic'
import * as firebase from 'firebase';
import { FirebaseMessaging, FirebaseApp } from "@angular/fire";


@Injectable()
export class FcmService {

  constructor(
      public platform: KnownPlatform
  ){}

  async getToken() {
      let token;

    if(this.platform=='android'){
        token = firebase.messaging().getToken();
        firebase.messaging().requestPermission();
    }

    if(this.platform=='ios'){
        token = firebase.messaging().getToken();
        firebase.messaging().requestPermission();
    }

    if(this.platform!='browser'){
        console.log('token en web')
    }
    return this.saveTokenToFirebase(token);
  }
  
  private saveTokenToFirebase(token){
    if(!token) return;
    const ref = firebase.database().ref('tokens');

    ref.set(token => {token:token;user:'asdaisd'})
  }

  listenToNotifications(){
    firebase.messaging().setBackgroundMessageHandler(payload => console.log(payload));
  }

}
