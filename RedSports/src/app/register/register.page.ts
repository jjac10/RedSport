import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
      { type: 'required', message: 'Obligatorio introducir email' },
      { type: 'pattern', message: 'Introduce un email existente' }
    ],
    'password': [
      { type: 'required', message: 'Obligatorio introducir contraseña' },
      { type: 'pattern', message: 'La contraseña debe tener mínimo 6 caracteres' }
    ]
  }

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
      ])),
    });
  }

  tryRegister(value){
    this.authService.registerUser(value)
     .then(res => {
       console.log(res);
       this.errorMessage = "";
       this.successMessage = "La cuenta se ha creado correctamente. Ya puede iniciar sesión.";
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }
 
  goLoginPage(){
    this.router.navigateByUrl('/');
  }
}
