import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FcmService } from '../services/fcm.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  
  validation_messages = {
    'email': [
      { type: 'required', message: 'Introduce tu email' },
      { type: 'pattern', message: 'Introduce un email existente' }
    ],
    'password': [
      { type: 'required', message: 'Introduce tu contraseña' },
      { type: 'pattern', message: 'La contraseña debe tener mínimo 6 caracteres' }
    ],
    'password2': [
      { type: 'required', message: 'Repite tu contraseña' },
      { type: 'pattern', message: 'La contraseña debe tener mínimo 6 caracteres' }
    ],
    'nick': [
      { type: 'required', message: 'Introduce tu nombre de usuario'},
      { type: 'pattern', message: 'El nombre de usuario debe tener mínimo 4 letras' }
    ],
    'nombre': [
      { type: 'required', message: 'Introduce tu nombre'},
      { type: 'pattern', message: 'El nombre debe tener mínimo 2 letras' }
    ],
    'apellidos': [
      { type: 'required', message: 'Introduce tus apellidos'},
      { type: 'pattern', message: 'El apellido debe tener mínimo 2 letras' }
    ],
    'telefono': [
      { type: 'required', message: 'Introduce tu número de teléfono'},
      { type: 'pattern', message: 'El número de teléfono debe tener mínimo 5 números' }
    ]
  }

  constructor(
    private router: Router,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private database: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      password2: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      nick: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
      ])),
      nombre: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
      ])),
      apellidos: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
      ])),
      telefono: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
      ])),
    });
  }

  register(value){
    if(value.password == value.password2) {
      this.authService.registerUser(value).then(
        res => {
          let node = this.database.database.ref('users/')

          console.log(res)

          node.update({ 
              [res.user.uid]: {
                  "nombre": value.nombre,
                  "apellidos": value.apellidos,
                  "nick": value.nick,
                  "email": value.email,
                  "telefono": value.telefono,
                  "descripcion": "",
                  "seguidores": 0,
                  "avatar": Math.floor(Math.random()*(10-1)) + 1
              }
            }
          )
          
          this.errorMessage = "";
          this.successMessage = "La cuenta se ha creado correctamente. Ya puede iniciar sesión.";
  
          this.router.navigateByUrl('tabs/inicio')
        }, 
        err => {
          console.log(err)

          if(err.message == "The email address is already in use by another account.") {
            this.errorMessage = "El email introducido ya está registrado"
          } else {
            this.errorMessage = err.message
          }
          this.successMessage = "";
        }
      )
    } else {
      this.errorMessage = "Las contraseñas son diferentes"
    }
  }
 
  goLoginPage(){
    this.router.navigateByUrl('/');
  }
}
