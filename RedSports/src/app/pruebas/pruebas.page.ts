import { Component, OnInit } from '@angular/core';
import {AngularFireMessaging} from "@angular/fire/messaging";
import { FcmService } from "../services/fcm.service";

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.page.html',
  styleUrls: ['./pruebas.page.scss'],
})
export class PruebasPage implements OnInit {

  constructor(public msg:AngularFireMessaging, public fcm:FcmService) {
  
  }

  testing(){
    this.fcm.enviarNotificacion('WRGuide','enlace','texto')
    /*this.fcm.sendFCM(
        'ck5zqvIEmhg:APA91bEbzKbPIKOXFmMHePW0DAE5d4Hde1Kjg-S77wjLAngQhHgEy2MKg89gRfpsKaO4yQNlxdSWtVWyrtEw_I9XCUMg-RrmsaA0dg7v5fhjy75AtHB8BFSZz5jONmvIYRkAkqFKe-Ps',
        'Titulo',
        'Cuerpo'
    );*/
  }

  ngOnInit() {
  }

}
