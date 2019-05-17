import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit {

  constructor(public fbd:AngularFireDatabase){ }

  ngOnInit() {
  }

  addEvent(nombreEvento: string, descripcionEvento: string, ubicacionEvento: string): void {
    if (nombreEvento === undefined || descripcionEvento === undefined || ubicacionEvento === undefined) {
      return;
    }

    //CAMBIAR POR ID CUANDO ESTE LOGIN
    this.fbd.database.ref('eventos/').push({
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