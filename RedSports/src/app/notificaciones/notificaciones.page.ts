import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";
import { NavController } from '@ionic/angular';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../authentication.service';

@Component({
    selector: 'app-notificaciones',
    templateUrl: './notificaciones.page.html',
    styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
    
    constructor(
        public navCtrl: NavController,
        private router: Router,
        private authService: AuthenticateService
    ) {}

    ngOnInit() {}

    search() {
        this.router.navigateByUrl('/tabs/eventos')
    }

    userProfile() {
      this.router.navigateByUrl('/tabs/perfil')
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
}
