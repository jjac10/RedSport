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
        this.usuarioPerfil.nombre = usuarioPerfil.val().nombre 
        this.usuarioPerfil.descripcion = usuarioPerfil.val().descripcion
        this.usuarioPerfil.seguidores = usuarioPerfil.val().seguidores
      }else{
        this.usuarioPerfil.user= this.idUsuario
        this.usuarioPerfil.nombre = "usuario1"
        this.usuarioPerfil.descripcion = "Diria que soy un tipo normal a quien le gustan los deportes"
        this.usuarioPerfil.seguidores = 3
      }
    });
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
