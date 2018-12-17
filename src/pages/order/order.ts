import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { SelectPopoverPage } from '../select-popover/select-popover';
import { TabsPage } from '../tabs/tabs';
import { StorageProvider } from '../../providers/storage/storage';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';
import { OrderProvider } from '../../providers/order/order';
import { MemberProvider } from '../../providers/member/member';
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
  
  ordererName: string;
  ordererMobile: string;
  ordererEmail: string;
  recieverName: string;
  reciverAddress: string;
  ordererMobile1: string;
  ordererMobile2: string;
  ordererMobile3: string;
  recieverMobile1: string;
  recieverMobile2: string;
  recieverMobile3: string;
  address1: string;
  address2: string;
  address3: string;

  deliveryMemoLists = [];
  deliveryTimeLists = [];
  mobileOptionLists = [];

  orderInfo = { type: "", customInfo: {}, orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, paymentMethod: "", deliveryTime: "선택사항", deliveryMemo: "선택사항" , orderedProducts: [] }; // type : member or nonMember 
  customInfo = { ordererName: "", ordererMobile: "", ordererEmail: "", recieverName: "", recieverAddress: "", recieverMobile: ""};
  memberAddressLists = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl:AlertController, 
    public storageProvider:StorageProvider, public shoppingbasketProvider:ShoppingbasketProvider, public orderProvider:OrderProvider, public memberProvider:MemberProvider) {

    this.isMember = storageProvider.isMember;
    this.deliveryMemoLists = storageProvider.deliveryMemoLists;
    this.deliveryTimeLists = storageProvider.deliveryTimeLists;
    this.mobileOptionLists = storageProvider.mobileOptionLists;

    this.isMember = this.storageProvider.isMember;
    this.basicPlaceStyle = { 'select-segment': true, 'unselect-segment': false};
    this.newPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
    this.selectedDeliveryType = 'memberSaved';
    
    if(this.isMember == true){
      this.orderInfo.type = "member";
      this.customInfo.ordererName = this.memberProvider.memberData.name;
      this.customInfo.ordererMobile = this.memberProvider.memberData.mobile;
      this.customInfo.ordererEmail = this.memberProvider.memberData.email;
      this.memberAddressLists = this.memberProvider.deliveryAddrs;
      this.customInfo.recieverName = this.memberAddressLists[0].receiver;
      this.customInfo.recieverAddress = this.memberAddressLists[0].address;
      this.customInfo.recieverMobile = this.memberAddressLists[0].mobile;
      this.orderInfo.customInfo = this.customInfo;
    }else{
      this.orderInfo.type = "nonMember";
      this.orderInfo.customInfo = this.customInfo;
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
    const popover = this.popoverCtrl.create(SelectPopoverPage, { addressLists: this.memberAddressLists}, { cssClass:'delivery-popover'});
    popover.onDidDismiss(idx => {
      this.customInfo.recieverName = this.memberAddressLists[idx].receiver;
      this.customInfo.recieverAddress = this.memberAddressLists[idx].address;
      this.customInfo.ordererMobile = this.memberAddressLists[idx].mobile;
    })
    popover.present();
  }

   moveToHome() {
    this.navCtrl.setRoot(TabsPage);
  }

  confirmOrder(){

    if(this.isMember == true){
      this.enterMemberOrderInfo();
      this.orderProvider.addOrderInfo(this.orderInfo);
      this.shoppingbasketProvider.completeShopping();
      this.navCtrl.setRoot(TabsPage, { tabIndex: 5 });
    } else if (this.emailCheck(this.ordererEmail)==true){
      this.enterNonMemberOrderInfo();
      this.orderProvider.addOrderInfo(this.orderInfo);
      this.shoppingbasketProvider.completeShopping();
      this.navCtrl.setRoot(TabsPage, { tabIndex: 5 });
    } 
  }

  selectedPaymentMethod(method){
    //console.log(method);
    
    if(method == 'cash'){
      this.orderInfo.paymentMethod = '현장결제';
    }else if(method == "card"){
      this.orderInfo.paymentMethod = '카드결제';
    }else if(method == 'bank'){
      this.orderInfo.paymentMethod = '무통장입금'
    }else{
      console.log("error paymentMethod doesn't pick");
      
    }

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

  enterMemberOrderInfo(){
    if(this.selectedDeliveryType == "memberSaved"){
      this.orderInfo.customInfo = this.customInfo;
    }else if(this.selectedDeliveryType == "memberNew"){
      this.customInfo.recieverName = this.recieverName;
      this.customInfo.recieverMobile = this.recieverMobile1 + "-" + this.recieverMobile2 + "-" + this.recieverMobile3;
      this.customInfo.recieverAddress = this.trim(this.address1) + " " + this.trim(this.address2) + " " + this.trim(this.address3);
      this.customInfo.recieverAddress = this.trim(this.customInfo.recieverAddress);
      this.orderInfo.customInfo = this.customInfo;
    }else{
      console.log("error selectDeliveryType in enterMemberOrderInfo()");
    }
  }

  enterNonMemberOrderInfo(){
    this.customInfo.ordererName = this.ordererName;
    this.customInfo.ordererMobile = this.ordererMobile1 + "-" + this.ordererMobile2 + "-" + this.ordererMobile3;
    this.customInfo.ordererEmail =  this.ordererEmail;
    this.customInfo.recieverName = this.recieverName;
    this.customInfo.recieverMobile = this.recieverMobile1 + "-" + this.recieverMobile2 + "-" + this.recieverMobile3;
    this.customInfo.recieverAddress = this.trim(this.address1) + " " + this.trim(this.address2) + " " + this.trim(this.address3);
    this.customInfo.recieverAddress = this.trim(this.customInfo.recieverAddress);

    this.orderInfo.customInfo = this.customInfo;
  }

  trim(str) {
    if(str!=undefined){
      return str.replace(/(^\s*)|(\s*$)/gi, "");
    }else{
      return "";
    }
  }

  emailCheck(email){
    let regEmailPattern = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    this.ordererEmail = this.trim(this.ordererEmail);
    
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
