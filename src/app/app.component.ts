import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { ServerProvider } from '../providers/server/server';
import { StorageProvider } from '../providers/storage/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private serverProvider:ServerProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.serverProvider.loadCategory().then((res: any) => {
        this.serverProvider.productAllCategories = res;
        for (let i = 0; i < this.serverProvider.productAllCategories.length; i++) {
          this.serverProvider.productAllCategories[i].selected = false;
        }
        console.log("category load");
      }, (err) => {
        console.log(err);
      });

      statusBar.styleDefault();
      statusBar.styleBlackOpaque()
      splashScreen.hide();
    });
  }
}
