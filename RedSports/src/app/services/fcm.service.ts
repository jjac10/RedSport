import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFireDatabase} from '@angular/fire/database';
import { HttpClient} from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class FcmService {

  constructor(
    private firebase: Firebase,
    private afs: AngularFireDatabase,
    private platform: Platform,
    private auth: AngularFireAuth,
    private http:HttpClient
  ) {}

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
    let nodo = this.afs.database.ref('users/'+this.auth.auth.currentUser.uid+"/token/");
    return nodo.set(token);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }

  //Enviamos una bd-notificacion y a su vez una push notificacion.
  //usuario = Nick de usuario al que se le envia
  //enlace = Contenido al que se le redirije (P.E: '/tabs/eventos/-LfFWG4XoLrDZdkD-0Sk')
  //titulo = Aviso, Invitacion o Comentario (elegir uno)
  //texto = Contenido del mensaje (
      //P.E: Fulanito te ha respondido a un comentario)
      //P.E: Fulanito te ha invitado a un evento)
      //P.E: Fulanito se ha apuntado a tu evento)
  enviarNotificacion(usuario,enlace,titulo,texto){

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
                    "fecha": parseInt(timestamp.toFixed()),
                    "titulo": titulo
                }).then(data => {
                  if(user.token)
                    this.sendFCM(user.token,titulo,texto)

                }).catch(err => {console.log(err)})
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

  unixTimeToDateTime(unix){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}