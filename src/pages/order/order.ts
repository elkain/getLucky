import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { SelectPopoverPage } from '../select-popover/select-popover';
import { TabsPage } from '../tabs/tabs';
import { StorageProvider } from '../../providers/storage/storage';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';
import { OrderProvider } from '../../providers/order/order';
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

  orderInfo = {type:"", customInfo:{}, orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, paymentMethod:"", orderedProducts: [] }; // type : member or nonMember 
  nonMemberInfo = {ordererName: "", ordererMobile: "", ordererEmail: "", recieverName: "", recieverAddress: "", recieverMobile:"", deliveryTime:"", deliveryMemo:""};
  memberInfo = {recieverName: "", recieverAddressLists: [], recieverMobile1: "",  deliveryTime: "", deliveryMemo: "" };

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl:AlertController,
    public storageProvider:StorageProvider, public shoppingbasketProvider:ShoppingbasketProvider, public orderProvider:OrderProvider) {

    this.isMember = this.storageProvider.isMember;
    this.basicPlaceStyle = { 'select-segment': true, 'unselect-segment': false};
    this.newPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
    this.selectedDeliveryType = 'memberSaved';
    
    if(this.isMember == true){
      this.orderInfo.type = "member";
      this.orderInfo.customInfo = this.memberInfo;
    }else{
      this.orderInfo.type = "nonMember";
      this.orderInfo.customInfo = this.nonMemberInfo;
    }

    if (navParams.get("class") == "buy") {
      let product;
      product = navParams.get("product");
      
      this.orderInfo.orderPrice = product.price * product.count;
      this.orderInfo.sale = (product.price - product.salePrice) * product.count;

      if ((this.orderInfo.orderPrice - this.orderInfo.sale) >= this.storageProvider.deliveryFreeFee) {
        this.orderInfo.deliveryFee = 0;
      } else {
        this.orderInfo.deliveryFee = this.storageProvider.deliveryFee;
      }

      this.orderInfo.totalPrice = product.salePrice * product.count + this.orderInfo.deliveryFee;
      this.orderInfo.orderedProducts.push(product);

    } else if (navParams.get("class") == "shoppingbasket"){
      let shoppingbasket = this.shoppingbasketProvider.shoppingBasket;
      let productsCount = shoppingbasket.orderedProducts.length;

      this.orderInfo.orderedProducts = [];

      if (shoppingbasket.checkedAllProducts == true){
        this.orderInfo.orderedProducts = shoppingbasket.orderedProducts;
      }else{
        for (let i = 0; i < productsCount; i++) {
          if (shoppingbasket.checkedProducts[i] == true) {
            this.orderInfo.orderedProducts.push(shoppingbasket.orderedProducts[i]);
          }
        }
      }
      
      this.orderInfo.orderPrice = shoppingbasket.orderPrice;
      this.orderInfo.sale = shoppingbasket.sale;
      this.orderInfo.deliveryFee = shoppingbasket.deliveryFee;
      this.orderInfo.totalPrice = shoppingbasket.totalPrice;
    } else {
      console.log("link error(orderPage)");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  selectBasicPlaceSegment(){
    this.basicPlaceStyle = { 'select-segment': true, 'unselect-segment': false };
    this.newPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
    this.selectedDeliveryType ="memberSaved";
  }

  selectNewPlaceSegment(){
    this.basicPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
    this.newPlaceStyle = { 'select-segment': true, 'unselect-segment': false };
    this.selectedDeliveryType = "memberNew";
  }

  hideDeliveryInfo(){
    
    if(this.showDeliveryInfo==true){
      this.showDeliveryInfo=false;
    } else if (this.showDeliveryInfo == false){
      this.showDeliveryInfo = true;
    } else{
      console.log("ShowDeliveryInfo error");
    }
  }

  hideProductInfo(){
    if (this.showProductInfo == true) {
      this.showProductInfo = false;
    } else if (this.showProductInfo == false) {
      this.showProductInfo = true;
    } else {
      console.log("showProductInfo error");
    }
  }

  hidePaymentInfo(){
    if (this.showPaymentInfo == true) {
      this.showPaymentInfo = false;
    } else if (this.showPaymentInfo == false) {
      this.showPaymentInfo = true;
    } else {
      console.log("showPaymentInfo error");
    }
  }

  hidePaymentMethodInfo() {

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

    if(this.isMember == true){

    } else if (this.emailCheck(this.nonMemberInfo.ordererEmail)==true){
      this.enterNonMemeberOrderInfo();
      this.orderProvider.addOrderInfo(this.orderInfo);
      console.log(this.orderInfo);
      this.navCtrl.setRoot(TabsPage, { tabIndex: 5 });
    } 
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

  enterNonMemeberOrderInfo(){
    console.log(this.nonMemberInfo);

    this.nonMemberInfo.ordererMobile = this.ordererMobile1 + "-" + this.ordererMobile2 + "-" + this.ordererMobile3;
    this.nonMemberInfo.recieverMobile = this.recieverMobile1 + "-" + this.recieverMobile2 + "-" + this.recieverMobile3;
    this.nonMemberInfo.recieverAddress = this.trim(this.address1) + " " + this.trim(this.address2) + " " + this.trim(this.address3);
    this.nonMemberInfo.recieverAddress = this.trim(this.nonMemberInfo.recieverAddress);

    this.orderInfo.customInfo = this.nonMemberInfo;
  }

  trim(str) {
    if(str!=undefined){
      return str.replace(/(^\s*)|(\s*$)/gi, "");
    }else{
      return;
    }
  }

  emailCheck(email){
    let regEmailPattern = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if(regEmailPattern.test(email)==false){
      let alert = this.alertCtrl.create({
        message: '이메일 주소를 확인해주세요',
        buttons: [{
          text: '확인'
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }else{
      return true;
    }
  }
}
