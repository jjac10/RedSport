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
        path: 'crear-evento',
        children: [
          {
            path: '',
            loadChildren: '../crear-evento/crear-evento.module#CrearEventoPageModule'
          }
        ]
      },
      { 
        path: 'modificar-perfil',
        children: [
          {
            path: '', 
            loadChildren: '../modificar-perfil/modificar-perfil.module#ModificarPerfilPageModule' 
          }
        ]
      },
      {
        path: 'post/:id',
        children: [
          {
            path: '',
            loadChildren: '../post/post.module#PostPageModule'
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
