import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'

/**
 * Generated class for the ProductdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-productdetail',
  templateUrl: 'productdetail.html',
})
export class ProductdetailPage {

  shopTitle: string = "MARKET LUCKY";

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App) {

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProductdetailPage');
  }

  backToHome(){
    this.navCtrl.pop();
  }

  moveToHome(){
    this.navCtrl.setRoot(TabsPage);
  }

  goToShoppingBasket() {
    this.navCtrl.setRoot(TabsPage, { tabIndex: 4 });
  }
}
