import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import firebase from 'firebase'

let config = {
  apiKey: "xxxx",
  authDomain: "xxxxx",
  databaseURL: "xxxxx",
  projectId: "xxxxx",
  storageBucket: "xxxx",
  messagingSenderId: "xxxxxxx"
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileChooser,File,FilePath, Camera,  /////
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
