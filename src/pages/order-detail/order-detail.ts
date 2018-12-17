import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';

/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  showProductInfo:boolean;
  showPaymentInfo:boolean;
  showDeliveryInfo:boolean;
  showPaymentbank: boolean;

  paymentMethodCategories = {bank:"무통장입금", card: "신용카드", cash:"현장결재"};
  paymentMethod: string;

  orderInfo:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public orderProvider: OrderProvider) {
    this.showProductInfo = true;
    this.showPaymentInfo = true;
    this.showDeliveryInfo = true;
    let param = navParams.data;

    if (param.class == "mypage"){
      let orderedNumber = navParams.data.orderedNumber;
      let idx;
      
      for (let i = 0; i < this.orderProvider.orderInfos.length; i++){
        if (this.orderProvider.orderInfos[i].id == orderedNumber){
          idx = i;
        }
      }
      
      this.orderInfo = this.orderProvider.orderInfos[idx];
    }else{
      this.orderInfo = this.orderProvider.orderInfos[this.orderProvider.orderInfos.length - 1];
    }
    this.paymentMethod = this.orderInfo.paymentMethod;
    
    if (this.paymentMethod == this.paymentMethodCategories.bank){
      this.showPaymentbank = true;
    }else{
      this.showPaymentbank = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }

  hideProductInfo() {
    if (this.showProductInfo == true) {
      this.showProductInfo = false;
    } else if (this.showProductInfo == false) {
      this.showProductInfo = true;
    } else {
      console.log("showProductInfo error");
    }
  }

  hidePaymentInfo() {
    if (this.showPaymentInfo == true) {
      this.showPaymentInfo = false;

      if (this.paymentMethod == this.paymentMethodCategories.bank){
        this.showPaymentbank = false;
      }
    } else if (this.showPaymentInfo == false) {
      this.showPaymentInfo = true;

      if (this.paymentMethod == this.paymentMethodCategories.bank) {
        this.showPaymentbank = true;
      }
    } else {
      console.log("showPaymentInfo error");
    }
  }


  hideDeliveryInfo() {
    if (this.showDeliveryInfo == true) {
      this.showDeliveryInfo = false;
    } else if (this.showDeliveryInfo == false) {
      this.showDeliveryInfo = true;
    } else {
      console.log("ShowDeliveryInfo error");
    }
  }
}
