import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy  } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { firebaseConfig } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireMessagingModule } from "@angular/fire/messaging";

import { FcmService } from './services/fcm.service';
import { Firebase } from '@ionic-native/firebase/ngx';
import { HttpClientModule } from '@angular/common/http';

import { AuthenticateService } from './services/authentication.service';
import { ReactiveFormsModule,FormBuilder } from '@angular/forms';



@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,      
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireDatabaseModule,
      AngularFireMessagingModule,
      AngularFireAuthModule,
      RouterModule,
      HttpClientModule
    ],
    providers: [
      StatusBar,
      SplashScreen,
      AuthenticateService,
      ReactiveFormsModule,
      FormBuilder,
      Firebase,FcmService,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
  })
export class AppModule {}
