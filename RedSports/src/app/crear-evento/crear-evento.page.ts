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

    var newPostKey = firebase.database().ref().child('eventos').push().key;

/*
    var eventosRef = this.ref.child("eventos");

    eventosRef.push({
      titulo: "nombreEvento",
      descripcion: "descripcionEvento",
      ubicacion: "ubicacionEvento"
    })
  */
  }
  
}