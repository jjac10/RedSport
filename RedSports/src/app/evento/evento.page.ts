import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import { FcmService } from '../services/fcm.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { debug } from 'util';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {

  lat: number = 38.353738;
  lng: number = -0.4901846;
  zoom: number = 15;
  

  ref
  public buttonColor: string = "secondary"
  public participar: string = "Participar"
  public subscritoAEvento: boolean 
  evento: any = {}

  //Cambiar cuando este el login
  public user: string = ""
  public idEvento: string
  
  imagen: string;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    public alertCtrl: AlertController,
    public fbd:AngularFireDatabase,
    public auth:AngularFireAuth,
    private authService: AuthenticateService,
    public fcm:FcmService
  )
  { 
    this.user = this.auth.auth.currentUser.uid;
    this.idEvento = this.route.snapshot.paramMap.get('id');
    this.imagen  = this.route.snapshot.paramMap.get('id');
    this.verEvento()
    this.comprobarEventoSubscrito()
    this.obtenerCoordenadas()
  }

  ngOnInit() {
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
      console.log(res)
      this.router.navigateByUrl('/')
    })
    .catch(error => {
      console.log(error)
    })
  }

  verEvento() {
    this.ref = this.fbd.database.ref('eventos/'+this.idEvento)
    this.ref.on('value', evento => { 
      if(evento.exists()) {
        this.evento.key= this.idEvento
        this.evento.titulo = evento.val().titulo 
        this.evento.descripcion = evento.val().descripcion
        this.evento.ubicacion = evento.val().ubicacion
      }
    });
  }

  apuntarseEnEvento() {
    if(this.subscritoAEvento == false) {
      this.ref = this.fbd.database.ref('eventos/'+this.idEvento)
      this.ref.once('value', evento => { 
        if(evento.exists()) {
            this.ref.child('participantes').update({ [this.user]: true }).then(data => {
                this.ref = this.fbd.database.ref('users/'+this.user+'/eventos/')
                this.ref.child('participa').update({ [this.idEvento]: true }).then( data => {
                    this.notificacionApuntarse()
                    this.participar = "Desapuntarse"
                    this.apuntarse()
                })
            })     
        }
    })} else {
      this.fbd.database.ref('users/'+this.user+'/eventos/participa/'+this.idEvento).remove()
      this.fbd.database.ref('eventos/'+this.idEvento+'/participantes/'+this.user).remove()
      this.participar = "Apuntarse"
      this.apuntarse()
    }
  }

  comprobarEventoSubscrito() {
    this.ref = this.fbd.database.ref('users/'+this.user+'/eventos/participa/'+this.idEvento)
    this.ref.on('value', evento => { 
      if(evento.exists()) {
        this.subscritoAEvento = true
        this.buttonColor = "danger"
        this.participar = "Desapuntarse"
      } else {
        this.subscritoAEvento = false
        this.buttonColor = "secondary"
        this.participar = "Apuntarse"
      }
    })
  }

  apuntarse() {
    //console.log(this.participar)
    if(this.participar == 'Desapuntarse') {
      this.buttonColor = "danger"
      this.participar = "Desapuntarse"
    } else {
      this.buttonColor = "secondary"
      this.participar = "Participarse"
    }
  }

  borrarEvento() {
    this.ref = this.fbd.database.ref('eventos/'+this.idEvento+'/creador/'+this.user)
    this.ref.on('value', creador => { 
      if(creador.exists()) {
        this.fbd.database.ref('eventos/'+this.idEvento).remove()
        this.router.navigateByUrl('tabs/eventos')
      }
    })
  } 

  doPrompt() {
    let prompt = this.alertCtrl.create({
      header: 'Invitar a evento',
      message: "Introduce el usuario al que quieres invitar",
      inputs: [
        {
          name: 'usuario',
          placeholder: 'nombre del usuario'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Invitar',
          handler: data => {
            this.invitarUsuario(data)
          }
        }
      ]
    });

    prompt.then((_prompt: any)=> {
      _prompt.present(); 
    })
  }

  notificacionApuntarse(){
      this.fbd.database.ref('eventos/'+this.idEvento+'/creador/').once('value',data => {
        let idCreador = Object.keys(data.val())[0]
        console.log(idCreador)
        if(idCreador){
            this.fbd.database.ref('users/'+idCreador+"/nick").once('value', data => {
                console.log(data)
                let nickDueno = data.val();
                if(nickDueno){
                    console.log(this.user)
                    this.fbd.database.ref('users/'+this.user+'/nick').once('value', data => {
                        console.log(data)
                        let nickMio = data.val()
                        if(nickMio) {
                            this.fcm.enviarNotificacion(nickDueno,'/tabs/evento/'+this.idEvento,'Aviso',`El usuario ${nickMio} se ha apuntado a un evento tuyo`)
                        }
                   })
                }
            })
        }
      })

  }

  invitarUsuario(data: any) {
    if(data.usuario && data.usuario!=''){
        let node = this.fbd.database.ref('eventos/'+this.idEvento+"/creador/")
        node.once('value', data1 => {
            data1.forEach(elemento => {
                if(elemento.key){
                    let node2 = this.fbd.database.ref('users/'+elemento.key+"/nick/")
                    node2.once('value', data2 => {
                        let nick = data2.val()
                        if(nick){
                            this.fcm.enviarNotificacion(
                                data.usuario,
                                '/tabs/evento/'+this.idEvento,
                                'Invitacion',
                                'El usuario '+nick+' te ha invitado a un evento'
                            )
                        }
                    })
                }
            });
        })        
    }
       
  }
  
  showAlert() {
    const alert = this.alertCtrl.create({
      header: 'Invitación enviada!',
      subHeader: 'La invitación al evento ha sido enviada correctamente',
      buttons: ['OK']
    });
    alert.then((_alert: any)=> {
      _alert.present(); 
    })
  }
  
  obtenerCoordenadas() {
    this.ref = this.fbd.database.ref('eventos/'+this.idEvento+'/coordenadas')
      this.ref.on('value', coordenadas => {
        this.lat = coordenadas.val().latitud
        this.lng = coordenadas.val().longitud
    })  
  }
}
