import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
import { AngularFireDatabase } from "@angular/fire/database";
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  ref
  usuarioPerfil: any = {}
  public user: string = "gb8KcNeo7dZXUyhWmGhmHAYjosu2"

  constructor(
    private router: Router,
    private authService: AuthenticateService,
    public fbd:AngularFireDatabase
  ) { }

  ngOnInit() {
    this.ref = this.fbd.database.ref('users/'+this.user)
    this.ref.on('value', usuarioPerfil => { 
      if(usuarioPerfil.exists()) {
        this.usuarioPerfil.user= this.user
        this.usuarioPerfil.nombre = "aaa"//usuarioPerfil.val().nombre 
        this.usuarioPerfil.descripcion = "aaa"//usuarioPerfil.val().descripcion
        this.usuarioPerfil.seguidores = 12//usuarioPerfil.val().seguidores
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
