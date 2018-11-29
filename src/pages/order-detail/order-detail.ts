import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  showProductInfo;
  showPaymentInfo;
  showDeliveryInfo;
  paymentMethodCategories = {cash:"무통장입금(입금완료)", card: "신용카드"};
  paymentMethod = this.paymentMethodCategories.card;
  
  showPaymentbank;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.showProductInfo = true;
    this.showPaymentInfo = true;
    this.showDeliveryInfo = true;

    if (this.paymentMethod == this.paymentMethodCategories.cash){
      this.showPaymentbank = true;
    }else{
      this.showPaymentbank = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }


  hideProductInfo() {
    console.log("button click", this.showProductInfo);

    if (this.showProductInfo == true) {
      this.showProductInfo = false;
      
    } else if (this.showProductInfo == false) {
      this.showProductInfo = true;
    } else {
      console.log("showProductInfo error");
    }
  }

  hidePaymentInfo() {
    console.log("button click", this.showPaymentInfo);

    if (this.showPaymentInfo == true) {
      this.showPaymentInfo = false;

      if (this.paymentMethod == this.paymentMethodCategories.cash){
        this.showPaymentbank = false;
      }
    } else if (this.showPaymentInfo == false) {
      this.showPaymentInfo = true;

      if (this.paymentMethod == this.paymentMethodCategories.cash) {
        this.showPaymentbank = true;
      }
    } else {
      console.log("showPaymentInfo error");
    }
  }


  hideDeliveryInfo() {
    console.log("button click");

    if (this.showDeliveryInfo == true) {
      this.showDeliveryInfo = false;
    } else if (this.showDeliveryInfo == false) {
      this.showDeliveryInfo = true;
    } else {
      console.log("ShowDeliveryInfo error");
    }
  }
}
