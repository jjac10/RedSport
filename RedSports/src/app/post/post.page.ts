import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FcmService } from '../services/fcm.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseDatabase } from '@angular/fire';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  
  post

  constructor(
    private route: ActivatedRoute,
    private fcm: FcmService,
    private alertCtrl: AlertController,
    private auth: AngularFireAuth,
    private fbd: AngularFireDatabase
  ){
    this.fbd.database.ref('/posts/' + this.route.snapshot.paramMap.get('id'))
    .on('value', postData => {
      this.post = postData.val()
      this.post.uid = postData.key
      console.log(this.post)
    })
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.fbd.database.ref('/posts/' + this.route.snapshot.paramMap.get('id'))
    .on('value', postData => {
      this.post = postData.val()
      this.post.uid = postData.key
      console.log(this.post)
    })
  }

  comment() {
    let prompt = this.alertCtrl.create({
      header: 'Añadir respuesta',
      inputs: [
        {
          name: 'texto',
          placeholder: 'Me gustaría participar...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            this.crearRespuesta(data)
          }
        }
      ]
    })

    prompt.then((_prompt: any) => {
      _prompt.present();
    })
  }

  crearRespuesta(data) {
    this.fbd.database.ref('users/' + this.auth.auth.currentUser.uid)
    .once('value', usuario => {
      let user = usuario.val()

      if(user){
        data.fecha = this.fcm.unixTimeToDateTime(Date.now())
        data.img = user.avatar
        data.nick = user.nick

        this.fbd.database.ref('posts/' + this.post.uid + '/respuestas').push(data)
        .then(resp => {
          this.fbd.database.ref('posts/' + this.post.uid).once('value', comment => {
            this.fbd.database.ref('posts/' + this.post.uid)
            .update({'numComments': comment.val().numComments + 1})
          })
        })

        this.fcm.enviarNotificacion(
          this.post.nick, 
          '/tabs/post/' + this.post.uid, 
          'Comentario', 
          user.nombre + ' ' + user.apellidos + '(' + user.nick + ') te ha respondido a un comentario')
      }
    })
  }
}
