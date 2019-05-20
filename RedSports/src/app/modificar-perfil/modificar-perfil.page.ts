import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authentication.service';
import { AngularFireDatabase } from "@angular/fire/database";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FcmService } from '../services/fcm.service';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.page.html',
  styleUrls: ['./modificar-perfil.page.scss'],
})
export class ModificarPerfilPage implements OnInit {
  ref
  usuarioPerfil: any = {}
  public idUsuario: string

  /**Validar */
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  
  validation_messages = {
    'email': [
      { type: 'pattern', message: 'Introduce un email existente' }
    ],
    'nombre': [
      { type: 'pattern', message: 'El nombre debe tener mínimo 2 letras' }
    ],
    'apellidos': [
      { type: 'pattern', message: 'El apellido debe tener mínimo 2 letras' }
    ],
    'telefono': [
      { type: 'pattern', message: 'El número de teléfono debe tener mínimo 5 números' }
    ]
  }

  constructor(
    private router: Router,
    private authService: AuthenticateService,
    public fbd:AngularFireDatabase,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit() {

    this.validations_form = this.formBuilder.group({
      descripcion: new FormControl('', Validators.compose([
        Validators.nullValidator,
        Validators.minLength(0),
      ])),
      email: new FormControl('', Validators.compose([
        Validators.nullValidator,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      nombre: new FormControl('', Validators.compose([
        Validators.nullValidator,
        Validators.minLength(2),
      ])),
      apellidos: new FormControl('', Validators.compose([
        Validators.nullValidator,
        Validators.minLength(2),
      ])),
      telefono: new FormControl('', Validators.compose([
        Validators.nullValidator,
        Validators.minLength(5),
      ])),
    });

    this.iniciarValores()
  }

  iniciarValores(){
    this.idUsuario= "V6Aach2YNlMX9lfRfoaBLOgJAEF2"//this.fbd.database.app.auth().currentUser.uid
    this.ref = this.fbd.database.ref('users/'+this.idUsuario)
    this.ref.on('value', usuarioPerfil => { 
      if(usuarioPerfil.exists()) {
        this.usuarioPerfil.user= this.idUsuario
        this.usuarioPerfil.nombre = usuarioPerfil.val().nombre 
        this.usuarioPerfil.apellidos = usuarioPerfil.val().apellidos
        this.usuarioPerfil.email = usuarioPerfil.val().email
        this.usuarioPerfil.telefono = usuarioPerfil.val().telefono
        this.usuarioPerfil.descripcion = usuarioPerfil.val().descripcion
        this.usuarioPerfil.nick = usuarioPerfil.val().nick

      }else{https://console.firebase.google.com/project/redsports-2f263/database/redsports-2f263/data/?hl=es-419
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

  editarPerfil(value) {
        
    this.ref = this.fbd.database.ref('users/'+this.idUsuario)
    this.ref.on('value', idUsuario => { 
      if(idUsuario.exists()) {
        this.ref.update({ nombre: value.nombre })
        this.ref.update({ email: value.email })
        this.ref.update({ apellidos: value.apellidos })
        this.ref.update({ telefono: value.telefono })
        this.ref.update({ descripcion: value.descripcion })
      }
    })

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
