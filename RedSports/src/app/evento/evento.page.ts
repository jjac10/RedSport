import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {
  ref
  public buttonColor: string = "secondary"
  public participar: string = "Participar"
  public subscritoAEvento: boolean 
  evento: any = {}

  //Cambiar cuando este el login
  public user: string = "gb8KcNeo7dZXUyhWmGhmHAYjosu2"
  public idEvento: string
  
  constructor(private router: Router, private route: ActivatedRoute, public alertCtrl: AlertController) { 
    this.idEvento = this.route.snapshot.paramMap.get('id');
    this.verEvento()
    this.comprobarEventoSubscrito()
  }

  ngOnInit() {
  }

  verEvento() {
    this.ref = firebase.database().ref('eventos/'+this.idEvento)
    this.ref.on('value', evento => { 
      if(evento.exists()) {
        this.evento.key= this.idEvento
        this.evento.titulo = evento.val().titulo 
        this.evento.descripcion = evento.val().descripcion
        this.evento.ubicacion = evento.val().ubicacion
      }
    });
  }

  apuntarseEnEvento() {
    if(this.subscritoAEvento == false) {
      this.ref = firebase.database().ref('eventos/'+this.idEvento)
      this.ref.on('value', evento => { 
        if(evento.exists()) {
          this.ref.child('participantes').update({ [this.user]: true })
          this.ref = firebase.database().ref('users/'+this.user+'/eventos/')
          this.ref.child('participa').update({ [this.idEvento]: true })
          this.participar = "Desapuntarse"
          this.apuntarse()
        }
    })} else {
      firebase.database().ref('users/'+this.user+'/eventos/participa/'+this.idEvento).remove()
      firebase.database().ref('eventos/'+this.idEvento+'/participantes/'+this.user).remove()
      this.participar = "Apuntarse"
      this.apuntarse()
    }
  }

  comprobarEventoSubscrito() {
    this.ref = firebase.database().ref('users/'+this.user+'/eventos/participa/'+this.idEvento)
    this.ref.on('value', evento => { 
      if(evento.exists()) {
        this.subscritoAEvento = true
        this.buttonColor = "danger"
        this.participar = "Desapuntarse"
      } else {
        this.subscritoAEvento = false
        this.buttonColor = "secondary"
        this.participar = "Apuntarse"
      }
    })
  }

  apuntarse() {
    //console.log(this.participar)
    if(this.participar == 'Desapuntarse') {
      this.buttonColor = "danger"
      this.participar = "Desapuntar"
    } else {
      this.buttonColor = "secondary"
      this.participar = "Participar"
    }
  }

  borrarEvento() {
    this.ref = firebase.database().ref('users/' + this.user + '/eventos/creados/'+this.idEvento)
    this.ref.on('value', evento => { 
      if(evento.exists()) {
        firebase.database().ref('eventos/'+this.idEvento).remove()
        this.ref.remove()
        this.router.navigateByUrl('tabs/eventos')
      }
    })
  } 

  doPrompt() {
    let prompt = this.alertCtrl.create({
      header: 'Invitar a evento',
      message: "Introduce el usuario al que quieres invitar",
      inputs: [
        {
          name: 'usuario',
          placeholder: 'usuario'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Invitar',
          handler: data => {
            this.invitarUsuario(data)
          }
        }
      ]
    });

    prompt.then((_prompt: any)=> {
      _prompt.present(); 
    })
  }

  invitarUsuario(data: any) {
    var key= firebase.database().ref('notificaciones/').push().key
    this.ref = firebase.database().ref('users/')
      this.ref.on('value', usuarios => {
        usuarios.forEach(usuario => {
          if(usuario.val().nombre == data.usuario) {
            this.ref = firebase.database().ref('notificaciones/'+key)
            this.ref.update({ 
              texto: usuario.val().nombre+" te ha invitado a un evento",
              leido: false,
              evento: this.idEvento
            })
            firebase.database().ref('users/'+usuario.key+"/notificaciones/").update({ [key]: true })
            this.showAlert()
          }
      });
    })
  }
  
  showAlert() {
    const alert = this.alertCtrl.create({
      header: 'Invitación enviada!',
      subHeader: 'La invitación al evento ha sido enviada correctamente',
      buttons: ['OK']
    });
    alert.then((_alert: any)=> {
      _alert.present(); 
    })
  }
  /*
  invitarUsuario(data: any) {
    this.ref = firebase.database().ref('users/')
      this.ref.on('value', usuarios => {
        usuarios.forEach(usuario => {
          if(usuario.val().nombre == data.usuario && ok) {
            this.ref = firebase.database().ref('users/'+usuario.key).child('notificaciones').push({texto: true})
          }
      });
    })  
  }*/
}
