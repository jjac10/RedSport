import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticateService } from '../services/authentication.service';
import { Router } from '@angular/router';

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
  
  ref
  items = []  
  itemsFiltrados = []

  public buscado:string = ""

  constructor(
    public navCtrl: NavController,
    public fbd:AngularFireDatabase,
    public fa:AngularFireAuth,
    private router: Router,
    private authService: AuthenticateService
  ) 
  {
    this.obtenerDatos()
    this.itemsFiltrados = this.items
  }

  ionViewWillEnter(){
    this.obtenerDatos()
    this.itemsFiltrados = this.items
  }

  ngOnInit() { }

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

  obtenerDatos(){
   
    this.ref = this.fbd.database.ref('eventos/')
    this.ref.on('value', eventos => {
        this.items = []
        eventos.forEach(eventos => {
        this.fbd.database.ref('eventos/' + eventos.key + '/').on('value', infoEvento => {
                let evento = infoEvento.val()
                if(evento){
                    evento.key = eventos.key
                    this.items.push(evento)
                }
            })
        });
    })
        
        
  }

  filter(){
    this.itemsFiltrados = this.items.filter(item => {
      let titulo = item.titulo      
      return titulo.toLocaleLowerCase().indexOf(this.buscado.toLocaleLowerCase())>-1;
    })

    /*this.itemsPendientesFiltrados = this.itemsPendientes.filter(item => {
      return item.toLocaleLowerCase().indexOf(this.buscado.toLocaleLowerCase())>-1;
    })*/
  }
}