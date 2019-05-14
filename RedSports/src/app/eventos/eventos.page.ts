import { Component, OnInit } from '@angular/core';

import * as firebase from "firebase";
import { NavController } from '@ionic/angular';

export interface Evento {
  id: number,
  titulo: string,
  ubicacion: string,
  descripcion: string
}

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {
  
  items = []
  ref

  constructor(public navCtrl: NavController) {
    this.obtenerDatos()
   }

  ngOnInit() { }

  obtenerDatos(){
    this.items = []
    firebase.auth().signInWithEmailAndPassword('wrguide@gmail.com', 'prueba')
        .then(res => {
            console.log('logged in')
            this.ref = firebase.database().ref('eventos/')
            this.ref.on('value', eventos => {
              eventos.forEach(eventos => {
                    firebase.database().ref('eventos/' + eventos.key + '/').on('value', infoEvento => {
                        let evento = infoEvento.val()
                        evento.key = eventos.key
                        this.items.push(evento)
                    })
                });
            })
        })
        .catch(err => {
            console.log(err)
        })
  }


  filterList(evt) {
    const searchTerm = evt.srcElement.value;
    
    if (!searchTerm) {
      return;
    }
    
    this.items = this.items.filter(currentGoal => {
      if (currentGoal.goalName && searchTerm) {
        if (currentGoal.goalName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }
}