import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'
import { BuyPage } from '../buy/buy';
import { OrderProvider } from '../../providers/order/order';
import { ServerProvider } from '../../providers/server/server';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public orderProvider:OrderProvider, 
    public serverProvider:ServerProvider, public alertCtrl:AlertController) {
    this.product = this.navParams.get("product");
    this.deliveryFee = this.orderProvider.deliveryFee;
    this.deliveryFreeString = this.orderProvider.deliveryFreeString;
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ProductdetailPage');
  }

  back(){
    this.refreshToken();
    this.navCtrl.pop();
  }

  moveToHome(){
    this.refreshToken();
    this.navCtrl.setRoot(TabsPage, {class:undefined});
  }

  goToShoppingBasket() {
    this.refreshToken();
    this.navCtrl.setRoot(TabsPage, { tabIndex: 4 });
  }

  goToBuy(){
    this.refreshToken();
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

  refreshToken(){
    this.serverProvider.validateAccessToken().then((res)=>{
      if(res == 'success'){
        return true;
      }else{
        return false;
      }
    }, err =>{
      console.log(err);
      
      let alert = this.alertCtrl.create({
        message:'세션이 만료되었습니다.',
        buttons:[{
          text: '확인',
          handler: () => {
            this.navCtrl.setRoot(TabsPage, { class: "productdetail", tabIndex: 0 });
          }
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    });

    return false;
  }
}
