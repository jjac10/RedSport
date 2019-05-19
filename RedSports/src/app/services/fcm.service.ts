import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFireDatabase} from '@angular/fire/database';
import { HttpClient} from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { ElementSchemaRegistry } from '@angular/compiler';


@Injectable()
export class FcmService {

  constructor(
    private firebase: Firebase,
    private afs: AngularFireDatabase,
    private platform: Platform,
    private auth: AngularFireAuth,
    private http:HttpClient
  ) {}

  async getToken(guardar) {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }
    if(guardar)
        this.saveToken(token);
    else
        return token
  }

  private saveToken(token) {
    if (!token) return;
    const devicesRef = this.afs.database.ref('pruebasNot/');
    return devicesRef.set(token);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }

  enviarNotificacion(usuario,enlace,texto){

    this.afs.database.ref('users/').orderByChild('nick').equalTo(usuario).on('value', data => {
        data.forEach( item => {
            let user = item.val();
            user.key = item.key;
            console.log(user);
            let node = this.afs.database.ref('notificaciones/')
                let timestamp = Date.now()/1000.0;
                node.push({
                    "para": user.key,
                    "enlace": enlace,
                    "texto": texto,
                    "leido": false,
                    "fecha": parseInt(timestamp.toFixed())
                })
        });
    })
  }

  sendFCM(to,titulo,cuerpo){
    this.http.post('https://fcm.googleapis.com/fcm/send',
    {
      "to" : to,
      "data": {
        "title":titulo,
        "body":cuerpo
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAA05pJEUQ:APA91bEKJonwZnlzI-eIpiE3kIe8egH5Vgatf9AcN_hRCkXhOdrmoMGzbexwbGUnRTveE3b87VFK2Nh0dE99H07aUH4bD5vQ2eIFMRNXT87Skzl-kEy6J4yajokBmlrcqVWya1wRpVcn'
      }
    }).toPromise().then(data => console.log(data)).catch(err => console.log(err))
  }
}