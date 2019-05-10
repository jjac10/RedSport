import { Component, OnInit } from '@angular/core';


import * as firebase from "firebase";
import { NavController } from '@ionic/angular';
import { ViewEncapsulation } from '@angular/compiler/src/core';

@Component({
    selector: 'app-notificaciones',
    templateUrl: './notificaciones.page.html',
    styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
    
    items = []
    ref
    modo: string = 'participa'

    constructor(public navCtrl: NavController) {
        this.obtenerDatos()
    }

    ngOnInit() { }

    obtenerDatos(){
        this.items = []
        console.log('loaded. ahora inicio sesion')
        firebase.auth().signInWithEmailAndPassword('wrguide@gmail.com', 'prueba')
            .then(res => {
                console.log('logged in')
                this.ref = firebase.database().ref('users/' + res.user.uid + '/eventos/'+this.modo+'/')
                this.ref.on('value', eventosUsuarios => {
                    eventosUsuarios.forEach(eventoUsuario => {
                        firebase.database().ref('eventos/' + eventoUsuario.key + '/').on('value', infoEvento => {
                            let evento = infoEvento.val()
                            evento.key = eventoUsuario.key
                            this.items.push(evento)
                        })
                    });
                })
            })
            .catch(err => {
                console.log(err)
            })
        console.log('pepe')
    }
    cambiarTipo(event) {
        console.log('a ' +this.modo)
        console.log('b ' +event.detail.value)
        if(this.modo != event.detail.value){
            
            this.modo = event.detail.value
            this.obtenerDatos()
        }
    }
}
