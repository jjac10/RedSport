import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-notificaciones',
    templateUrl: './notificaciones.page.html',
    styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
    
    itemsPorLeer:Array<any> = []
    itemsLeidos:Array<any> = []

    constructor(
        public navCtrl: NavController,
        private router: Router,
        private authService: AuthenticateService,
        public fbd:AngularFireDatabase,
        public auth:AngularFireAuth
    ) {}

    ngOnInit() {}

    ionViewWillEnter(){
        if(this.auth.auth.currentUser)
            this.getNotices();
        else
            this.router.navigateByUrl('/')
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
            this.router.navigateByUrl('/')
        })
        .catch(error => {
            console.log(error)
        })
    }

    marcarVisto(cadena){
       let estado = this.fbd.database.ref('notificaciones/'+cadena+"/leido/")
       estado.set(true)
    }

    redirect(enlace){
        this.router.navigateByUrl(enlace)
    }

    getNotices(){
        let nodo = this.fbd.database.ref('notificaciones/').orderByChild('para').equalTo(this.auth.auth.currentUser.uid);
        nodo.on('value', listaNoticias => {
            this.itemsPorLeer = []
            this.itemsLeidos = []
            listaNoticias.forEach( noticia => {
                let notice = noticia.val();
                if(notice){
                    notice.key = noticia.key
                    if(notice.leido)
                        this.itemsLeidos.push(notice)
                    else 
                        this.itemsPorLeer.push(notice)
                }               
            })                               
        })
        
    }
}

