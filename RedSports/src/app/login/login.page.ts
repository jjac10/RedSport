import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticateService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder
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
      ]))
    })
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'Introduce tu email' },
      { type: 'pattern', message: 'Introduce un email existente' }
    ],
    'password': [
      { type: 'required', message: 'Introduce tu contraseña' },
      { type: 'pattern', message: 'La contraseña debe tener mínimo 6 caracteres' }
    ]
  }

  login(value) {
    this.authService.loginUser(value)
    .then(res => {
      console.log(res)
      this.errorMessage = ""
      this.router.navigateByUrl('tabs/inicio')
    }, err => {
      if(err.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
        this.errorMessage = "No existe el usuario seleccionado"
      } else if(err.message == "The password is invalid or the user does not have a password."){
        this.errorMessage = "Contraseña inválida o el usuario no tiene una"
      } else {
        this.errorMessage = err.message
      }
    })
  }

  register() {
    this.router.navigateByUrl('/register')
  }
}
