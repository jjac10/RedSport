import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

export interface Evento {
  id: number,
  titulo: string,
  ubicacion: string,
  descripcion: string
}

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {
  
  ref
  items = []  
  itemsFiltrados = []

  public buscado:string = ""

  constructor(public navCtrl: NavController,public fbd:AngularFireDatabase,public fa:AngularFireAuth) {
    this.obtenerDatos()
    this.itemsFiltrados = this.items
   }

  ngOnInit() { }

  obtenerDatos(){
    this.items = []
    
    this.fa.auth.signInWithEmailAndPassword('wrguide@gmail.com', 'prueba')
        .then(res => {
            console.log('logged in')
            this.ref = this.fbd.database.ref('eventos/')
            this.ref.on('value', eventos => {
              eventos.forEach(eventos => {
                this.fbd.database.ref('eventos/' + eventos.key + '/').on('value', infoEvento => {
                        let evento = infoEvento.val()
                        if(evento){
                            evento.key = eventos.key
                            this.items.push(evento)
                        }
                    })
                });
            })
        })
        .catch(err => {
            console.log(err)
        })
  }

  filter(){
    this.itemsFiltrados = this.items.filter(item => {
      let titulo = item.titulo      
      return titulo.toLocaleLowerCase().indexOf(this.buscado.toLocaleLowerCase())>-1;
    })

    /*this.itemsPendientesFiltrados = this.itemsPendientes.filter(item => {
      return item.toLocaleLowerCase().indexOf(this.buscado.toLocaleLowerCase())>-1;
    })*/
  }
}