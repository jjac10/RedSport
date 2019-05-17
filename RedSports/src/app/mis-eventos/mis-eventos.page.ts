import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";
import { NavController } from '@ionic/angular';
import { ViewEncapsulation } from '@angular/compiler/src/core';

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

    constructor(public navCtrl: NavController) {
        this.obtenerDatos();
        this.itemsFiltrado = this.items;
    }

    ngOnInit() {
        let a = firebase.database().ref().child('eventos').orderByChild('titulo').equalTo('Petanca');
        a.once('value').then(data => {
            console.log(data)
        }).catch(error => { console.log(error) })
    }

    obtenerDatos() {
        this.items = []
        this.itemsFiltrado = []
        console.log('loaded. ahora inicio sesion')
        firebase.auth().signInWithEmailAndPassword('wrguide@gmail.com', 'prueba')
            .then(res => {
                console.log('logged in')
                this.ref = firebase.database().ref('users/' + res.user.uid + '/eventos/' + this.modo + '/')
                this.ref.on('value', eventosUsuarios => {
                    eventosUsuarios.forEach(eventoUsuario => {
                        firebase.database().ref('eventos/' + eventoUsuario.key + '/').on('value', infoEvento => {
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
        console.log('a ' + this.modo)
        console.log('b ' + event.detail.value)
        if (this.modo != event.detail.value) {

            this.modo = event.detail.value
            this.obtenerDatos()
        }
    }

}
