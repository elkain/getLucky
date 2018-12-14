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

  product:any;
  deliveryFee:number;
  deliveryFreeString:string;
  orderInfo = { orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, shoppingBasket: [] };

  constructor(public navCtrl: NavController, public navParams: NavParams, private popoverCtrl: PopoverController, 
    public storageProvider: StorageProvider, public shoppingbasketProvider: ShoppingbasketProvider, public orderProvider: OrderProvider) {

    this.product = this.navParams.get("product");
    
    this.product.salePrice = this.shoppingbasketProvider.calProductSalePrice(this.product);
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

    //this.calOrderInfo();
    this.orderProvider.orderProduct(this.product);

    this.navCtrl.push(OrderPage, { class: "OrderPage" });
  }

  addToShoppingBasket() {
    
    this.storageProvider.addShoppingBasket(this.product);
    this.shoppingbasketProvider.addShoppingBasket(this.product);

    const popover = this.popoverCtrl.create(ShoppingbasketPopoverPage, {}, { cssClass: 'popover-shopping-basket' });
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

  /*calOrderInfo(){
    this.orderInfo.shoppingBasket=[];
    this.orderInfo.shoppingBasket.push(this.product);
    this.orderInfo.orderPrice = this.product.price * this.product.count;
    this.orderInfo.sale = (this.product.price - this.product.salePrice) * this.product.count;

    if ((this.orderInfo.orderPrice - this.orderInfo.sale) >= this.storageProvider.deliveryFreeFee) {
      this.orderInfo.deliveryFee = 0;
    } else if (this.orderInfo.orderPrice == 0) {
      this.orderInfo.deliveryFee = 0;
    } else {
      this.orderInfo.deliveryFee = this.storageProvider.deliveryFee;
    }

    this.orderInfo.totalPrice = this.orderInfo.orderPrice - this.orderInfo.sale + this.orderInfo.deliveryFee;
  }*/
}
