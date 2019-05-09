import { Component, OnInit } from '@angular/core';


import  * as firebase from "firebase";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  items;
  ref = firebase.database().ref('test/')
  inputText:string = ''

  snapshotToArray(snapshot){
    let returnArray = []

    snapshot.forEach(element => {
      let item = element.val()
      item.key = element.key
      returnArray.push(item)
    });
    return returnArray
  }

  constructor(public navCtrl: NavController) {
    this.ref.on('value',resp => {
      this.items = this.snapshotToArray(resp)
    })
   }

  addItem(item){
    if(item!=undefined && item!=null){
      let newItem = this.ref.push()
      newItem.set(item)
      this.inputText = ''
    }
  }

  ngOnInit(){}
}
