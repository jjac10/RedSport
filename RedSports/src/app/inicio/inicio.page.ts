import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  private posts = []
  ref
  constructor(
    private router: Router,
    private authService: AuthenticateService,
    private alertCtrl: AlertController,
    private auth: AngularFireAuth,
    private fbd: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.fbd.database.ref('posts/').orderByChild('fecha').on('value', data => {
      data.forEach(post => {
        this.posts.push(post.val())
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
    var user = this.fbd.database.ref('users/' + this.fbd.database.app.auth().currentUser.uid)
    .on('value', usuario => {
      console.log(usuario)
    })

    console.log(user)

    data.user = this.fbd.database.app.auth().currentUser.uid
    data.fecha = new Date().toLocaleString().replace(",","")
    console.log(data.fecha)

    this.fbd.database.ref('posts/').push(data)
  }

  verPerfil(value) {
    this.ref = this.fbd.database.ref('users/')
    this.ref.on('value', usuarioPerfil => { 
      usuarioPerfil.forEach(usu => {
            let usuario = usu.val()
            if(usuario.nick == value){
              this.router.navigateByUrl('/tabs/perfil-publico/'+usu.key)
            }
        })
      });

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
      console.log(res)
      this.router.navigateByUrl('/')
    })
    .catch(error => {
      console.log(error)
    })
  }

}
