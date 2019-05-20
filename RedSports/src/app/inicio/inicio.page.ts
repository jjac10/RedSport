import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { FcmService } from '../services/fcm.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  private posts = []

  constructor(
    private router: Router,
    private authService: AuthenticateService,
    private alertCtrl: AlertController,
    private auth: AngularFireAuth,
    private fbd: AngularFireDatabase,
    private fcm: FcmService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.fbd.database.ref('posts/').orderByChild('fecha').on('value', data => {
      this.posts = []
      
      data.forEach(post => {
        let comment = post.val()
        comment.uid = post.ref.key
        
        this.posts.push(comment)
      })
    })
  }

  doPrompt() {
    let prompt = this.alertCtrl.create({
      header: 'Añadir comentario',
      inputs: [
        {
          name: 'texto',
          placeholder: 'Comentario...'
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
            this.crearComentario(data)
          }
        }
      ]
    })

    prompt.then((_prompt: any)=> {
      _prompt.present(); 
    })
  }

  crearComentario(data: any) {
    this.fbd.database.ref('users/' + this.auth.auth.currentUser.uid)
    .once('value', usuario => {
      let user = usuario.val()

      if(user){
        data.fecha = this.fcm.unixTimeToDateTime(Date.now())
        data.img = user.avatar
        data.likes = 0
        data.nick = user.nick
        data.numComments = 0

        this.fbd.database.ref('posts/').push(data)
      }
    })
  }

  like(post) {
    this.fbd.database.ref('posts/' + post.uid).once('value', comment => {
      this.fbd.database.ref('posts/' + post.uid).update({'likes': comment.val().likes + 1})
    })
  }

  comments(post) {
    this.router.navigateByUrl('/tabs/post/' + post.uid)  
  }

  userProfile() {
    this.router.navigateByUrl('/tabs/perfil')
  }

  search() {
    this.router.navigateByUrl('/tabs/eventos')
  }

  logout() {
    this.authService.logoutUser()
    .then(res => {
      this.router.navigateByUrl('/')
    })
    .catch(error => {
      console.log(error)
    })
  }
}
