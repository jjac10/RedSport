import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFireDatabase} from '@angular/fire/database';

@Injectable()
export class FcmService {

  constructor(private firebase: Firebase,
              private afs: AngularFireDatabase,
              private platform: Platform) {}

  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }

    this.saveToken(token);
  }

  private saveToken(token) {
    if (!token) return;
    const devicesRef = this.afs.database.ref('pruebasNot/');
    return devicesRef.set(token);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}