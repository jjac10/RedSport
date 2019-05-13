import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";

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


  public user: string = "gb8KcNeo7dZXUyhWmGhmHAYjosu2"
  public idEvento: string = '1023912309'
  constructor() { 
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
      this.ref = firebase.database().ref('users/'+this.user+'/eventos/')
      this.ref.child('participa').update({ [this.idEvento]: true })
      this.ref = firebase.database().ref('eventos/'+this.idEvento)
      this.ref.child('participantes').update({ [this.user]: true })
      this.participar = "Desapuntarse"
      this.apuntarse()
    } else {
      firebase.database().ref('users/'+this.user+'/eventos/participa/'+this.idEvento).remove()
      firebase.database().ref('eventos/'+this.idEvento+'/participantes/'+this.user).remove()
      this.participar = "Apuntarse"
      this.apuntarse()
    }
    console.log(this.buttonColor)
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
    console.log(this.participar)
    if(this.participar == 'Desapuntarse') {
      this.buttonColor = "danger"
      this.participar = "Desapuntar"
    } else {
      this.buttonColor = "secondary"
      this.participar = "Participar"
    }

    console.log(this.buttonColor)
  }

  borrarEvento() {
    this.ref = firebase.database().ref('users/' + this.user + '/eventos/creados/'+this.idEvento)
    this.ref.on('value', evento => { 
      if(evento.exists()) {
        firebase.database().ref('eventos/'+this.idEvento).remove()
        this.ref.remove()
      }
    })
  }
  
}
