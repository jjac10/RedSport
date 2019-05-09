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
    inputText: string = ''

    snapshotToArray(snapshot) {
        let returnArray = []

        snapshot.forEach(element => {
            let item = element.toJSON()
            returnArray.push(element.key)
        });
        return returnArray
    }

    constructor(public navCtrl: NavController) {
        console.log('loaded. ahora inicio sesion')
        firebase.auth().signInWithEmailAndPassword('wrguide@gmail.com', 'prueba')
            .then(res => {
                console.log('logged in')
                this.ref = firebase.database().ref('users/' + res.user.uid + '/eventos/participa/')
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

    addItem(item) {
        if (item != undefined && item != null) {
            let newItem = this.ref.push()
            newItem.set(item)
            this.inputText = ''
        }
    }

    ngOnInit() { }
}
