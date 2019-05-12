import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";

@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {
  ref
  public titulo: string
  public buttonColor: string = ""
  public participar: string = "Participar"

  public user: string = "gb8KcNeo7dZXUyhWmGhmHAYjosu2"
  public idEvento: string = '1023912309'
  public subscritoAEvento: boolean
  evento: any = {}

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
      this.ref = firebase.database().ref('users/'+this.user+'/eventos/participa/'+this.idEvento)
      this.ref.remove()
      this.ref = firebase.database().ref('eventos/'+this.idEvento+'/participantes/'+this.user)
      this.ref.remove()
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
        this.buttonColor = ""
        this.participar = "Apuntarse"
      }
    })
  }

  apuntarse() {
    if(this.participar == 'Desapuntarse') {
      this.buttonColor = "danger"
      this.participar = "Desapuntar"
    } else {
      this.buttonColor = ""
      this.participar = "Participar"
    }
  }
}
