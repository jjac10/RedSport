import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  private posts = []

  constructor(
    private router: Router,
    private authService: AuthenticateService,
    private fbd: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.fbd.database.ref('posts/').orderByChild('fecha').on('value', data => {
      data.forEach(post => {
        this.posts.push(post.val())
      })
    })
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
