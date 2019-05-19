import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticateService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mis-eventos',
    templateUrl: './mis-eventos.page.html',
    styleUrls: ['./mis-eventos.page.scss'],
})
export class MisEventosPage implements OnInit {

    items = [];
    itemsFiltrado = [];
    filtro:string;
    ref;
    modo: string = 'participa'

    constructor (
        public navCtrl: NavController,
        public fbd:AngularFireDatabase,
        public fa:AngularFireAuth,
        private router: Router,
        private authService: AuthenticateService
    ) { }

    ngOnInit() {
        this.obtenerDatos();
        this.itemsFiltrado = this.items;
        /* Busqueda 
        let a = this.fbd.database.ref().child('eventos').orderByChild('titulo').equalTo('Petanca');
        a.once('value').then(data => {
            console.log(data)
        }).catch(error => { console.log(error) })*/
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

    obtenerDatos() {
        this.items = []
        this.itemsFiltrado = []
        console.log('loaded. ahora inicio sesion')
        this.fa.auth.signInWithEmailAndPassword('wrguide@gmail.com', 'prueba')
            .then(res => {
                console.log('logged in')
                this.ref = this.fbd.database.ref('users/' + res.user.uid + '/eventos/' + this.modo + '/')
                this.ref.on('value', eventosUsuarios => {
                    eventosUsuarios.forEach(eventoUsuario => {
                        this.fbd.database.ref('eventos/' + eventoUsuario.key + '/').on('value', infoEvento => {
                            let evento = infoEvento.val()
                            if(evento){
                                evento.key = eventoUsuario.key
                            this.items.push(evento)
                            }
                        })
                    });
                    this.itemsFiltrado = this.items;
                })
            })
            .catch(err => {
                console.log(err)
            })
        console.log('pepe')
    }

    filtrar(){
        this.itemsFiltrado = this.items.filter(item => {
          let titulo = item.titulo      
          return titulo.toLocaleLowerCase().indexOf(this.filtro.toLocaleLowerCase())>-1;
        })
    
        /*this.itemsPendientesFiltrados = this.itemsPendientes.filter(item => {
          return item.toLocaleLowerCase().indexOf(this.buscado.toLocaleLowerCase())>-1;
        })*/
      }

    cambiarTipo(event) {
        if (this.modo != event.detail.value) {
            this.modo = event.detail.value
            this.obtenerDatos()
        }
    }

}
