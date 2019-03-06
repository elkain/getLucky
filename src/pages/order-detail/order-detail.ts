import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { ServerProvider } from '../../providers/server/server';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public orderProvider: OrderProvider, public serverProvider:ServerProvider,
    public alertCtrl:AlertController) {
    this.showProductInfo = true;
    this.showPaymentInfo = true;
    this.showDeliveryInfo = true;
    let param = navParams.data;

    if (param.class == "mypage"){
      let orderedNumber = navParams.data.orderedNumber;
      let idx;
      
      for (let i = 0; i < this.orderProvider.orderInfos.length; i++){
        if (this.orderProvider.orderInfos[i].orderID == orderedNumber){
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

  cancelOrder(orderInfo){
    this.serverProvider.cancelOrder(orderInfo).then((res:any)=>{
      console.log(res);
      if(res == "success"){
        let alert = this.alertCtrl.create({
          message: '주문이 취소 되었습니다.',
          buttons: [{
            text: '확인',
          }],
          cssClass: 'alert-modify-member'
        });
        alert.present();
      }else if(res=="invalid"){
        let alert = this.alertCtrl.create({
          message: '주문을 취소할수 없습니다.',
          buttons: [{
            text: '확인',
          }],
          cssClass: 'alert-modify-member'
        });
        alert.present();
      }
    },(err)=>{
      console.log(err);
      
    });
  }
}
