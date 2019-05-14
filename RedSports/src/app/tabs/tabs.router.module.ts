import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        children: [
          {
            path: '',
            loadChildren: '../inicio/inicio.module#InicioPageModule'
          }
        ]
      },
      {
        path: 'notificaciones',
        children: [
          {
            path: '',
            loadChildren: '../notificaciones/notificaciones.module#NotificacionesPageModule'
          }
        ]
      },
      {
        path: 'eventos',
        children: [
          {
            path: '',
            loadChildren: '../eventos/eventos.module#EventosPageModule'
          }
        ]
      },
      {
        path: 'chat',
        children: [
          {
            path: '',
            loadChildren: '../chat/chat.module#ChatPageModule'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
