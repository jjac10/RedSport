import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
import { AngularFireDatabase } from "@angular/fire/database";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-perfil-publico',
  templateUrl: './perfil-publico.page.html',
  styleUrls: ['./perfil-publico.page.scss'],
})
export class PerfilPublicoPage implements OnInit {
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
    this.miUser= this.fbd.database.app.auth().currentUser.uid
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
        this.usuarioPerfil.avatar = usuarioPerfil.val().avatar
      }else{
        this.usuarioPerfil.user= this.idUsuario
        this.usuarioPerfil.nick = "usuario1"
        this.usuarioPerfil.descripcion = "Diria que soy un tipo normal a quien le gustan los deportes"
        this.usuarioPerfil.seguidores = 3
      }
    });
  }

  obtenerEventos() {
    var miNick
    this.ref = this.fbd.database.ref('users/'+this.idUsuario)
    this.ref.on('value', usuarioPerfil => { 
      if(usuarioPerfil.exists()) {
        miNick = usuarioPerfil.val().nick 
      }
    })
    this.ref = this.fbd.database.ref('posts/')
    this.ref.on('value', misPosts => {
      misPosts.forEach(post => {
            let evento = post.val()
            if(evento.nick == miNick){
                evento.key = post.key
                this.items.push(evento)
            }
        })
      });
      this.itemsFiltrado = this.items;
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
