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
        path: 'evento/:id',
        children: [
          {
            path: '',
            loadChildren: '../evento/evento.module#EventoPageModule'
          }
        ]
      },
      {
        path: 'mis-eventos',
        children: [
          {
            path: '',
            loadChildren: '../mis-eventos/mis-eventos.module#MisEventosPageModule'
          }
        ]
      },
      {
        path: 'pruebas',
        children: [
          {
            path: '',
            loadChildren: '../pruebas/pruebas.module#PruebasPageModule'
          }
        ]
      },
      {
        path: 'perfil',
        children: [
          {
            path: '',
            loadChildren: '../perfil/perfil.module#PerfilPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      },
      {
        path: 'evento',
        children: [
          {
            path: '',
            loadChildren: '../evento/evento.module#EventoPageModule'
          }
        ]
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
