import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { ServerProvider } from '../../providers/server/server';

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

  orderCompInfo = {orderID:"", ordererName: "", receiverName:"", address:"", mobile:"", paymentMethod:"", paymentCharge:0};
  bankStatus = "(입금대기중)";

  constructor(public navCtrl: NavController, public navParams: NavParams, public orderProvider : OrderProvider, public serverProvider:ServerProvider) {

    let orderInfo = this.orderProvider.orderInfos[this.orderProvider.orderInfos.length - 1];
    this.orderCompInfo.orderID = orderInfo.orderID;
    this.orderCompInfo.ordererName = orderInfo.customInfo.ordererName;
    this.orderCompInfo.receiverName = orderInfo.customInfo.receiverName;
    this.orderCompInfo.address = orderInfo.customInfo.receiverAddress;
    this.orderCompInfo.mobile = orderInfo.customInfo.receiverMobile;
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
    this.serverProvider.loadOrderDetail(this.orderCompInfo.orderID).then((res: any) => {
      if (res == "success") {
        this.navCtrl.parent.select(6);
      }
    }, (err) => {
      console.log(err);

    });
    
  }
}
