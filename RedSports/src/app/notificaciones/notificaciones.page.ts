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
                    notice.time = this.unixTimeToDateTime(notice.fecha)
                    if(notice.leido){
                        this.itemsLeidos.push(notice)
                        this.itemsLeidos = this.itemsLeidos.sort((a, b) => b.fecha - a.fecha);
                        
                    }
                    else{
                        this.itemsPorLeer.push(notice)
                        this.itemsPorLeer = this.itemsPorLeer.sort((a, b) => b.fecha - a.fecha);
                    }
                }               
            })                               
        })
    }

    unixTimeToDateTime(unix){
        var date = new Date(unix*1000);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

}

