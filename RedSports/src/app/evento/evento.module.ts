import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventoPage } from './evento.page';
import { AgmCoreModule } from '@agm/core'

const routes: Routes = [
  {
    path: '',
    component: EventoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB12PdJDNFeE11NMIW3lcof1b3CCmzdfpI'
    })
  ],
  declarations: [EventoPage]
})
export class EventoPageModule {}
