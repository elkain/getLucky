import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'
import { ShoppingbasketPopoverPage } from '../shoppingbasket-popover/shoppingbasket-popover';
import { BuyPage } from '../buy/buy';
import { StorageProvider } from '../../providers/storage/storage';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public storageProvider:StorageProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductdetailPage');

  }

  back(){
    this.navCtrl.pop();
  }

  moveToHome(){
    this.navCtrl.setRoot(TabsPage);
  }

  goToShoppingBasket() {
    this.navCtrl.setRoot(TabsPage, { tabIndex: 4 });
  }

  addToShoppingBasket(){
    this.navCtrl.push(BuyPage, { class: "BuyPage" });
    //const popover = this.popoverCtrl.create(ShoppingbasketPopoverPage, {}, { cssClass: 'popover-shopping-basket' });
    //popover.present();
  }
}
