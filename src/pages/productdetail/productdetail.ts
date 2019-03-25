import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'
import { BuyPage } from '../buy/buy';
import { OrderProvider } from '../../providers/order/order';

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

  product:any;
  deliveryFee:number;
  deliveryFreeString:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public orderProvider:OrderProvider) {
    this.product = this.navParams.get("product");
    this.deliveryFee = this.orderProvider.deliveryFee;
    this.deliveryFreeString = this.orderProvider.deliveryFreeString;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductdetailPage');

  }

  back(){
    this.navCtrl.pop();
  }

  moveToHome(){
    this.navCtrl.setRoot(TabsPage, {class:undefined});
  }

  goToShoppingBasket() {
    this.navCtrl.setRoot(TabsPage, { tabIndex: 4 });
  }

  goToBuy(){
    this.navCtrl.push(BuyPage, { class: "productdetail", product:this.product});
  }

  displayNumber(number) {
    let temp = number;
    let displayNum = number.toString();
    let i = 0;
    let j = 3;
    while ((temp / 1000) > 1) {
      i = i + j;
      displayNum = displayNum.substr(0, displayNum.length - i) + ',' + displayNum.substr(-i);
      j = j + 1;
      temp /= 1000;
    }

    return displayNum;
  }
}
