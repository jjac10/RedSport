import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
import { AngularFireDatabase } from "@angular/fire/database";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  ref
  items = [];
  itemsFiltrado = [];
  usuarioPerfil: any = {}
  public user: string = this.route.snapshot.paramMap.get('id')
  public miUser: string 
  public idUsuario: string
  public miPerfil: boolean = false

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private authService: AuthenticateService,
    public fbd:AngularFireDatabase
  ) { }

  ngOnInit() {
    this.ponerDatos()
    this.obtenerEventos()
  }

  ponerDatos(){
    this.miUser= "V6Aach2YNlMX9lfRfoaBLOgJAEF2"//this.fbd.database.app.auth().currentUser.uid
    this.idUsuario = this.route.snapshot.paramMap.get('id');
    if (this.idUsuario == null || this.idUsuario == this.miUser){
      this.ref = this.fbd.database.ref('users/'+this.miUser)
      this.miPerfil=true
      this.idUsuario = this.miUser
    }else{
      this.ref = this.fbd.database.ref('users/'+this.idUsuario)
    }
    this.ref.on('value', usuarioPerfil => { 
      if(usuarioPerfil.exists()) {
        this.usuarioPerfil.user= this.idUsuario
        this.usuarioPerfil.nick = usuarioPerfil.val().nick 
        this.usuarioPerfil.descripcion = usuarioPerfil.val().descripcion
        this.usuarioPerfil.seguidores = usuarioPerfil.val().seguidores
      }else{
        this.usuarioPerfil.user= this.idUsuario
        this.usuarioPerfil.nick = "usuario1"
        this.usuarioPerfil.descripcion = "Diria que soy un tipo normal a quien le gustan los deportes"
        this.usuarioPerfil.seguidores = 3
      }
    });
  }

  obtenerEventos() {
    this.ref = this.fbd.database.ref('users/' + this.idUsuario + '/eventos/creados/')
    this.ref.on('value', eventosUsuarios => {
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
    })
  }

  userProfile() {
    this.router.navigateByUrl('/tabs/perfil')
  }

  seguir() {
    this.router.navigateByUrl('/tabs/perfil')
  }

  editarPerfil() {
    this.router.navigateByUrl('/tabs/modificar-perfil')
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

}
