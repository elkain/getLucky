import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { SelectPopoverPage } from '../select-popover/select-popover';
import { TabsPage } from '../tabs/tabs';
import { StorageProvider } from '../../providers/storage/storage';
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  isMember: boolean;
  
  selectedDeliveryType: string;
  showDeliveryInfo: boolean = true;
  showProductInfo: boolean = true;
  showPaymentInfo: boolean = true;
  showPaymentMethodInfo: boolean = true;

  basicPlaceStyle = new Object();
  newPlaceStyle = new Object();
  paymentMethodColor = { cash: "white", card: "white", bank: "white" };
  
  ordererMobile1: string;
  ordererMobile2: string;
  ordererMobile3: string;
  recieverMobile1: string;
  recieverMobile2: string;
  recieverMobile3: string;
  address1: string;
  address2: string;
  address3: string;

  orderInfo = {type:"", ordererInfo:{}, orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, paymentMethod:"", orderedProducts: [] }; // type : member or nonMember 
  nonMemberInfo = {ordererName : "", ordererMobile:"", ordererEmail:"", recieverName:"", recieverAddress:"", deliveryTime:"", deliveryMemo:""};
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public storageProvider:StorageProvider) {
    this.basicPlaceStyle = { 'select-segment': true, 'unselect-segment': false};
    this.newPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
    this.selectedDeliveryType='memberSaved';
    this.isMember = this.storageProvider.isMember;

    if (navParams.get("class") == "buy") {
      //this.orderInfo.orderedProducts = this.navParams.get("product");
      let product;
      product = navParams.get("product");
      console.log(product);
      this.calOrderPrice(product);  

      console.log(this.orderInfo);
      this.orderInfo.orderedProducts.push(product);
    } else {

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  selectBasicPlaceSegment(){
    this.basicPlaceStyle = { 'select-segment': true, 'unselect-segment': false };
    this.newPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
    this.selectedDeliveryType ="memberSaved";
    console.log(this.selectedDeliveryType);
  }

  selectNewPlaceSegment(){
    this.basicPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
    this.newPlaceStyle = { 'select-segment': true, 'unselect-segment': false };
    this.selectedDeliveryType = "memberNew";
    console.log(this.selectedDeliveryType);
  }

  hideDeliveryInfo(){
    console.log("button click");
    
    if(this.showDeliveryInfo==true){
      this.showDeliveryInfo=false;
    } else if (this.showDeliveryInfo == false){
      this.showDeliveryInfo = true;
    } else{
      console.log("ShowDeliveryInfo error");
    }
  }

  hideProductInfo(){
    console.log("button click", this.showProductInfo);

    if (this.showProductInfo == true) {
      this.showProductInfo = false;
    } else if (this.showProductInfo == false) {
      this.showProductInfo = true;
    } else {
      console.log("showProductInfo error");
    }
  }

  hidePaymentInfo(){
    console.log("button click", this.showPaymentInfo);

    if (this.showPaymentInfo == true) {
      this.showPaymentInfo = false;
    } else if (this.showPaymentInfo == false) {
      this.showPaymentInfo = true;
    } else {
      console.log("showPaymentInfo error");
    }
  }

  hidePaymentMethodInfo() {
    console.log("button click", this.showPaymentMethodInfo);

    if (this.showPaymentMethodInfo == true) {
      this.showPaymentMethodInfo = false;
    } else if (this.showPaymentMethodInfo == false) {
      this.showPaymentMethodInfo = true;
    } else {
      console.log("showPaymentInfo error");
    }
  }

  presentPopover() {
    const popover = this.popoverCtrl.create(SelectPopoverPage, {}, { cssClass:'delivery-popover'});
    popover.present();
  }

  moveToHome() {
    this.navCtrl.setRoot(TabsPage);
  }

  confirmOrder(){

    console.log(this.orderInfo);
    console.log(this.nonMemberInfo);
    
    this.navCtrl.setRoot(TabsPage, { tabIndex: 5 });
  }

  selectedPaymentMethod(method){
    this.orderInfo.paymentMethod = method;

    if (this.paymentMethodColor[method] == "#d3d3d3"){
      this.paymentMethodColor[method] = "white";  
    }else{
      for (let key in this.paymentMethodColor) {
        this.paymentMethodColor[key] = "white";
      }
      this.paymentMethodColor[method] = "#d3d3d3";
    }
  }

  findAddr(){

  }

  calOrderPrice(product) {

    this.orderInfo.orderPrice = product.price * product.count;
    this.orderInfo.sale = (product.price - product.salePrice) * product.count;

    if ((this.orderInfo.orderPrice - this.orderInfo.sale) >= this.storageProvider.deliveryFreeFee) {
      this.orderInfo.deliveryFee = 0;
    } else {
      this.orderInfo.deliveryFee = this.storageProvider.deliveryFee;
    }

    this.orderInfo.totalPrice = product.salePrice * product.count + this.orderInfo.deliveryFee;
  }
}
