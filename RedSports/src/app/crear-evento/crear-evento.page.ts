import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthenticateService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-crear-evento',
    templateUrl: './crear-evento.page.html',
    styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit {

    public miUser: string
    nombreEvento:string
    descripcionEvento:string
    ubicacionEvento:string

    constructor(
        public fbd: AngularFireDatabase,
        private router: Router,
        private authService: AuthenticateService
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter(){
        this.nombreEvento = ""
        this.descripcionEvento = ""
        this.ubicacionEvento = ""
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
                this.router.navigateByUrl('/')
            })
            .catch(error => {
                console.log(error)
            })
    }

    addEvent(nombreEvento: string, descripcionEvento: string, ubicacionEvento: string): void {
        if (nombreEvento === undefined || descripcionEvento === undefined || ubicacionEvento === undefined) {
            return;
        }

        this.miUser = this.fbd.database.app.auth().currentUser.uid

        this.fbd.database.ref('eventos/').push({
            creador: {
                [this.miUser]: true
            },
            titulo: nombreEvento,
            descripcion: descripcionEvento,
            ubicacion: ubicacionEvento
        }).then(data => {
            let key = data.key
            if (key) {
                this.fbd.database.ref('users/' + this.fbd.database.app.auth().currentUser.uid + '/eventos/creados/')
                    .update({ [key]: true })
            }
        });
    }


}