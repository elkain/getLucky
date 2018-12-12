import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { TabsPage} from '../tabs/tabs';
import { ShoppingbasketPopoverPage } from '../shoppingbasket-popover/shoppingbasket-popover';
import { OrderPage } from '../order/order';
import { StorageProvider } from '../../providers/storage/storage';

/**
 * Generated class for the BuyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buy',
  templateUrl: 'buy.html',
})
export class BuyPage {

  product;
  deliveryFee;
  deliveryFreeString;
  constructor(public navCtrl: NavController, public navParams: NavParams, private popoverCtrl: PopoverController, public storageProvider:StorageProvider) {
    this.product = this.navParams.get("product");
    
    this.product.salePrice = this.storageProvider.calProductSalePrice(this.product);
    this.product.totalPrice = this.product.salePrice * this.product.count;
    this.deliveryFee = storageProvider.deliveryFee;
    this.deliveryFreeString = storageProvider.deliveryFreeString;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuyPage');
  }

  moveToHome() {
    this.navCtrl.setRoot(TabsPage, {class:"TabsPage"});
  }

  goToShoppingBasket() {
    this.navCtrl.setRoot(TabsPage, { tabIndex: 4 });
  }

  goToOrder() {
    this.navCtrl.push(OrderPage, { class: "OrderPage" });
  }

  addToShoppingBasket() {
    
    this.storageProvider.addShoppingBasket(this.product);

    const popover = this.popoverCtrl.create(ShoppingbasketPopoverPage, { product: this.product }, { cssClass: 'popover-shopping-basket' });
    popover.present();
  }

  increaseProductNum(){
    this.product.count++;
    this.product.totalPrice = this.product.salePrice * this.product.count;
  }

  decreaseProductNum(){
    if (this.product.count > 1){
      this.product.count--;
    }

    this.product.totalPrice = this.product.salePrice * this.product.count;
  }
}
