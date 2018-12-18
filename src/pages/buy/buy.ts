import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { TabsPage} from '../tabs/tabs';
import { ShoppingbasketPopoverPage } from '../shoppingbasket-popover/shoppingbasket-popover';
import { OrderPage } from '../order/order';
import { StorageProvider } from '../../providers/storage/storage';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';
import { OrderProvider } from '../../providers/order/order';

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

  isMember;
  product:any;
  deliveryFee:number;
  deliveryFreeString:string;
  orderInfo = { orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, shoppingBasket: [] };

  constructor(public navCtrl: NavController, public navParams: NavParams, private popoverCtrl: PopoverController, 
    public storageProvider: StorageProvider, public shoppingbasketProvider: ShoppingbasketProvider, public orderProvider: OrderProvider) {

    this.product = this.navParams.get("product");
    this.isMember = this.storageProvider.isMember;
    this.product.count = 1;
    this.product.totalPrice = this.product.salePrice * this.product.count;
    this.deliveryFee = storageProvider.deliveryFee;
    this.deliveryFreeString = storageProvider.deliveryFreeString;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuyPage');
  }

  moveToHome() {
    this.navCtrl.setRoot(TabsPage, { class: undefined });
  }

  goToShoppingBasket() {
    this.navCtrl.setRoot(TabsPage, { tabIndex: 4 });
  }

  goToOrder() {
    this.orderProvider.orderedProduct = this.product;

    if(this.isMember == true){
      this.navCtrl.push(OrderPage, { class: "buy"});
    }else{
      this.navCtrl.push(TabsPage, { class: "buy", tabIndex: 3});
    }
  }

  addToShoppingBasket() {
    this.shoppingbasketProvider.addShoppingBasket(this.product);

    const popover = this.popoverCtrl.create(ShoppingbasketPopoverPage, {class:"buy"}, { cssClass: 'popover-shopping-basket' });
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
