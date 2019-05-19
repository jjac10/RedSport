import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticateService } from '../authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-notificaciones',
    templateUrl: './notificaciones.page.html',
    styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
    
    constructor(
        public navCtrl: NavController,
        private router: Router,
        private authService: AuthenticateService,
        public fbd:AngularFireDatabase,
        public auth:AngularFireAuth
    ) {}

    ngOnInit() {
        console.log(this.auth.auth.currentUser);
    }

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

    getNotices(){
        let ref = this.fbd.database.ref('notificaciones/').orderByChild('para').equalTo(this.auth.auth.currentUser.uid)
                /*ref.on('value', eventosUsuarios => {
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
                })*/
    }

}
