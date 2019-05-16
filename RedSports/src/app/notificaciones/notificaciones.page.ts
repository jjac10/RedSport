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
    
    constructor(public navCtrl: NavController) {
    }

    ngOnInit() {}

    
}
