import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController, App } from 'ionic-angular';
import { TabsPage} from '../tabs/tabs';
import { ShoppingbasketPopoverPage } from '../shoppingbasket-popover/shoppingbasket-popover';
import { OrderPage } from '../order/order';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';
import { OrderProvider } from '../../providers/order/order';
import { ServerProvider } from '../../providers/server/server';
import { Storage } from '@ionic/storage';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private popoverCtrl: PopoverController, private storage:Storage, public app:App,
     public shoppingbasketProvider: ShoppingbasketProvider, public orderProvider: OrderProvider, public serverProvider:ServerProvider, public alertCtrl:AlertController) {

    this.product = this.navParams.get("product");
    this.isMember = this.serverProvider.isMember;
    this.product.count = 1;
    this.product.totalPrice = (this.product.price - this.product.sale) * this.product.count;
    this.deliveryFee = orderProvider.deliveryFee;
    this.deliveryFreeString = orderProvider.deliveryFreeString;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuyPage');
  }

  moveToHome() {
    this.refreshToken();
    this.navCtrl.setRoot(TabsPage, { class: undefined });
  }

  goToShoppingBasket() {
    this.refreshToken();
    this.navCtrl.setRoot(TabsPage, { tabIndex: 4 });
  }

  goToOrder() {
    this.refreshToken();
    this.orderProvider.orderedProduct = this.product;

    if(this.isMember == true){
      this.navCtrl.push(OrderPage, { class: "buy"});
    }else{
      this.navCtrl.push(TabsPage, { class: "buy", tabIndex: 3});
    }
  }

  addToShoppingBasket() {
    let flag = this.shoppingbasketProvider.isProductInShoppingbasket(this.product);

    if (flag != true) {
      if (this.isMember == true) {
        this.serverProvider.addShoppingbasket(this.product);
      } else {
        this.shoppingbasketProvider.addShoppingBasket(this.product);
        this.storage.set("shoppingbasket", this.shoppingbasketProvider.shoppingBasket);
      }
    }
    
    const popover = this.popoverCtrl.create(ShoppingbasketPopoverPage, {class:"buy"}, { cssClass: 'popover-shopping-basket' });
    popover.present();
  }

  increaseProductNum(){
    this.product.count++;
    this.product.totalPrice = (this.product.price - this.product.sale) * this.product.count;
  }

  decreaseProductNum(){
    if (this.product.count > 1){
      this.product.count--;
    }

    this.product.totalPrice = (this.product.price - this.product.sale) * this.product.count;
  }

  refreshToken() {
    this.serverProvider.validateAccessToken().then((res) => {
      if (res == 'success') {
        return true;
      } else {
        return false;
      }
    }, err => {
      console.log(err);

      let alert = this.alertCtrl.create({
        message: '세션이 만료되었습니다.',
        buttons: [{
          text: '확인',
          handler: () => {
            this.app.getRootNavs()[0].push(TabsPage, { class: "home", tabIndex: 0 });
          }
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    });

    return false;
  }
}
