import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthenticateService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit {

  constructor(
    public fbd:AngularFireDatabase,
    private router: Router,
    private authService: AuthenticateService
  )
  { }

  ngOnInit() {
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