import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from "firebase";

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit {

  ref


  constructor(private router: Router) { }

  ngOnInit() {
  }

  addEvent(nombreEvento: string, descripcionEvento: string, ubicacionEvento: string): void {
    if (nombreEvento === undefined || descripcionEvento === undefined || ubicacionEvento === undefined) {
      return;
    }

    //CAMBIAR POR ID CUANDO ESTE LOGIN
    firebase.database().ref('eventos/').push({
      creador: {
        "gb8KcNeo7dZXUyhWmGhmHAYjosu3" : true
      },
      participantes: {
        "gb8KcNeo7dZXUyhWmGhmHAYjosu3" : true
      },
      titulo: nombreEvento,
      descripcion: descripcionEvento,
      ubicacion : ubicacionEvento
    });  
  }
  
}