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
  public miUser: string = "V6Aach2YNlMX9lfRfoaBLOgJAEF2"
  public idUsuario: string

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private authService: AuthenticateService,
    public fbd:AngularFireDatabase
  ) { }

  ngOnInit() {
    this.idUsuario = this.route.snapshot.paramMap.get('id');
    if (this.idUsuario == null){
      this.ref = this.fbd.database.ref('users/'+this.miUser)
    }else{
      this.ref = this.fbd.database.ref('users/'+this.idUsuario)
    }
    this.ref.on('value', usuarioPerfil => { 
      if(usuarioPerfil.exists()) {
        this.usuarioPerfil.user= this.user
        this.usuarioPerfil.nombre = usuarioPerfil.val().nombre 
        this.usuarioPerfil.descripcion = usuarioPerfil.val().descripcion
        this.usuarioPerfil.seguidores = usuarioPerfil.val().seguidores
      }else{
        this.usuarioPerfil.user= this.user
        this.usuarioPerfil.nombre = "usuario1"
        this.usuarioPerfil.descripcion = "Diria que soy un tipo normal a quien le gustan los deportes"
        this.usuarioPerfil.seguidores = 3
      }
    });
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

}
