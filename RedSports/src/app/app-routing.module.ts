import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'inicio', loadChildren: './inicio/inicio.module#InicioPageModule' },
  { path: 'notificaciones', loadChildren: './notificaciones/notificaciones.module#NotificacionesPageModule' },
  { path: 'eventos', loadChildren: './eventos/eventos.module#EventosPageModule' },
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },
  { path: 'perfil', loadChildren: './perfil/perfil.module#PerfilPageModule' },
  { path: 'pruebas', loadChildren: './pruebas/pruebas.module#PruebasPageModule' },  { path: 'pruebas', loadChildren: './pruebas/pruebas.module#PruebasPageModule' },
  { path: 'perfil', loadChildren: './perfil/perfil.module#PerfilPageModule' }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
