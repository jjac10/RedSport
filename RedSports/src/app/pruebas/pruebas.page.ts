import { Component, OnInit } from '@angular/core';
import {AngularFireMessaging} from "@angular/fire/messaging";
import { FcmService } from "../fcm.service";

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.page.html',
  styleUrls: ['./pruebas.page.scss'],
})
export class PruebasPage implements OnInit {

  constructor(public msg:AngularFireMessaging, public fcm:FcmService) {
  
  }

  testing(){
      this.fcm.sendFCM();
  }

  ngOnInit() {
  }

}
