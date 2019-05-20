import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FcmService } from '../services/fcm.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  private post
  private respuestas = []

  constructor(
    private route: ActivatedRoute,
    private fcm: FcmService,
    private alertCtrl: AlertController,
    private auth: AngularFireAuth,
    private fbd: AngularFireDatabase
  ){
    // this.fbd.database.ref('/posts/' + this.route.snapshot.paramMap.get('id'))
    // .on('value', postData => {
    //   this.post = postData.val()
    //   this.post.uid = postData.key

    //   let indicesResp = Object.keys(this.post.respuestas)

    //   indicesResp.forEach(e => {
    //     this.respuestas.push(this.post.respuestas[e])
    //   });

    //   console.log(this.respuestas)
    // })
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.fbd.database.ref('posts/' + this.route.snapshot.paramMap.get('id'))
    .on('value', postData => {
      this.post = postData.val()
      this.post.uid = postData.key

      this.fbd.database.ref('respuestas/' + this.post.uid).on('value', data => {
        this.respuestas = []

        data.forEach(resp => {
          let item = resp.val()
        
          if(item) {
            this.respuestas.push(item)
          }
        })
      })
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

        this.fbd.database.ref('respuestas/' + this.post.uid).push(data)
        .then(resp => {
          this.fbd.database.ref('posts/' + this.post.uid).once('value', comment => {
            this.fbd.database.ref('posts/' + this.post.uid)
            .update({'numComments': comment.val().numComments + 1}).then( f => {              
              this.fcm.enviarNotificacion(
                this.post.nick, 
                '/tabs/post/' + this.post.uid, 
                'Comentario', 
                user.nombre + ' ' + user.apellidos + '(' + user.nick + ') te ha respondido a un comentario')
              }
            )
          })
        })
      }
    })
  }
}
