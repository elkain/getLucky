import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';

/**
 * Generated class for the OrderCompletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-complete',
  templateUrl: 'order-complete.html',
})
export class OrderCompletePage {

  orderCompInfo = { ordererName: "", recieverName:"", address:"", mobile:"", paymentMethod:"", paymentCharge:0};
  bankStatus = "(입금대기중)";

  constructor(public navCtrl: NavController, public navParams: NavParams, public orderProvider : OrderProvider) {

    let orderInfo = this.orderProvider.orderInfos[this.orderProvider.orderInfos.length - 1];
    console.log(orderInfo);
    
    this.orderCompInfo.ordererName = orderInfo.customInfo.ordererName;
    this.orderCompInfo.recieverName = orderInfo.customInfo.recieverName;
    this.orderCompInfo.address = orderInfo.customInfo.recieverAddress;
    this.orderCompInfo.mobile = orderInfo.customInfo.recieverMobile;
    this.orderCompInfo.paymentMethod = orderInfo.paymentMethod;

    if(this.orderCompInfo.paymentMethod == "무통장입금"){
      this.orderCompInfo.paymentMethod += this.bankStatus;
    }

    this.orderCompInfo.paymentCharge = orderInfo.totalPrice;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderCompletePage');
  }

  goToOrderDetail(){
    this.navCtrl.parent.select(6);
  }
}
