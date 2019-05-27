import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SelectPopoverPage } from '../select-popover/select-popover';
import { TabsPage } from '../tabs/tabs';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';
import { OrderProvider } from '../../providers/order/order';
import { MemberProvider } from '../../providers/member/member';
import { ServerProvider } from '../../providers/server/server';
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

  shopTitle : string;
  isMember: boolean;
  
  selectedDeliveryType: string;
  showDeliveryInfo: boolean = true;
  showProductInfo: boolean = true;
  showPaymentInfo: boolean = true;
  showPaymentMethodInfo: boolean = true;

  basicPlaceStyle = new Object();
  newPlaceStyle = new Object();
  paymentMethodColor = { cash: "white", card: "white", bank: "white" };
  
  /*ordererName: string;
  ordererEmail: string;
  receiverName: string;
  receiverAddress: string;*/
  ordererName = "이철";
  ordererMobile: string;
  ordererEmail = "hee861213@naver.com"
  receiverName = "이혁";
  receiverAddress: string;
  /*ordererMobile1: string;
  ordererMobile2: string;
  ordererMobile3: string;*/
  ordererMobile1 = "010";
  ordererMobile2 = "8924";
  ordererMobile3 = "7278";
  /*receiverMobile1: string;
  receiverMobile2: string;
  receiverMobile3: string;*/
  receiverMobile1 =  "010";
  receiverMobile2 = "5269";
  receiverMobile3 = "8621";
  /*address1: string;
  address2: string;
  address3: string;*/
  address1 = "서울시 강동구 명일동";
  address2 = "현대아파트 15동 702호";
  address3: string;

  deliveryMemoLists = [];
  deliveryTimeLists = [];
  mobileOptionLists = [];

  prevPage = "";
  orderInfo = { type: "", customInfo: {}, orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, paymentMethod: "", paymentID:"", 
  deliveryTime: "선택사항", deliveryMemo: "선택사항" , orderedProducts: [] }; // type : member or nonMember 
  //orderInfo;
  customInfo = { ordererName: "", ordererMobile: "", ordererEmail: "", receiverName: "이혁", receiverAddress: "", receiverMobile: ""};
  memberAddressLists = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private alertCtrl:AlertController, 
    public shoppingbasketProvider: ShoppingbasketProvider, public orderProvider: OrderProvider, public memberProvider: MemberProvider, private storage: Storage,
    public serverProvider:ServerProvider) {

    this.shopTitle = this.serverProvider.shopTitle;

    this.deliveryMemoLists = serverProvider.deliveryMemoLists;
    this.deliveryTimeLists = serverProvider.deliveryTimeLists;
    this.mobileOptionLists = serverProvider.mobileOptionLists;

    this.isMember = this.serverProvider.isMember;
    this.basicPlaceStyle = { 'select-segment': true, 'unselect-segment': false};
    this.newPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
    this.selectedDeliveryType = 'memberSaved';
    
    if(this.isMember == true){
      this.orderInfo.type = "member";
      this.customInfo.ordererName = this.memberProvider.memberData.name;
      this.customInfo.ordererMobile = this.memberProvider.memberData.mobile;
      this.customInfo.ordererEmail = this.memberProvider.memberData.email;
      if (this.memberProvider.deliveryAddrs==undefined){
        this.memberAddressLists = [];  
        this.customInfo.receiverName = this.memberProvider.memberData.name;
        this.customInfo.receiverAddress = this.memberProvider.memberData.address;
        this.customInfo.receiverMobile = this.memberProvider.memberData.mobile;
      }else{
        this.memberAddressLists = this.memberProvider.deliveryAddrs;
        this.customInfo.receiverName = this.memberAddressLists[0].receiver;
        this.customInfo.receiverAddress = this.memberAddressLists[0].address;
        this.customInfo.receiverMobile = this.memberAddressLists[0].mobile;
      }
      
      this.orderInfo.customInfo = this.customInfo;
    }else{
      this.orderInfo.type = "nonMember";
      this.orderInfo.customInfo = this.customInfo;
    }

    this.prevPage = navParams.get("class");

    if (this.prevPage == "buy") {
      let product;
      product = this.orderProvider.orderedProduct;
      
      this.orderInfo.orderPrice = product.price * product.count;
      this.orderInfo.sale = product.sale * product.count;

      if ((this.orderInfo.orderPrice - this.orderInfo.sale) >= this.orderProvider.deliveryFreeFee) {
        this.orderInfo.deliveryFee = 0;
      } else {
        this.orderInfo.deliveryFee = this.orderProvider.deliveryFee;
      }

      this.orderInfo.totalPrice = (product.price - product.sale) * product.count + this.orderInfo.deliveryFee;
      this.orderInfo.orderedProducts.push(product);
      
    } else if (this.prevPage == "shoppingbasket"){
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
    this.orderInfo.deliveryMemo = this.deliveryMemoLists[1];
    this.orderInfo.deliveryTime = this.deliveryTimeLists[1];
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
    const popover = this.popoverCtrl.create(SelectPopoverPage, { addressLists: this.memberAddressLists }, { cssClass: 'delivery-popover'});
    popover.onDidDismiss(idx => {
      if(idx!=null){
        this.customInfo.receiverName = this.memberAddressLists[idx].receiver;
        this.customInfo.receiverAddress = this.memberAddressLists[idx].address;
        this.customInfo.ordererMobile = this.memberAddressLists[idx].mobile;
      }
    });
    popover.present();
  }

   moveToHome() {
    this.refreshToken();
    this.navCtrl.setRoot(TabsPage, {class:undefined});
  }

  confirmOrder(){
    if(this.isMember == true){
      this.enterMemberOrderInfo();
    } else{
      this.enterNonMemberOrderInfo();
    }
    console.log(this.orderInfo);
    
    if (this.nameCheck(this.customInfo.ordererName) && this.mobileCheck(this.customInfo.ordererMobile) && this.emailCheck(this.customInfo.ordererEmail) && 
    this.nameCheck(this.customInfo.receiverName) && this.addrCheck(this.customInfo.receiverAddress) && this.mobileCheck(this.customInfo.receiverMobile) && this.paymentMethodCheck(this.orderInfo.paymentMethod) == true) {
      
      this.serverProvider.orderProducts(this.orderInfo, this.prevPage, this.isMember).then((res:any)=>{
        if(res == "success"){
          this.navCtrl.setRoot(TabsPage, { tabIndex: 5 });
        }else if (res == 'not exist'){
          if (this.prevPage == "shoppingbasket") {
            this.shoppingbasketProvider.completeShopping();
            this.storage.set("shoppingbasket", this.shoppingbasketProvider.shoppingBasket);
          }

          this.navCtrl.setRoot(TabsPage, { tabIndex: 5 });
        }else if(res=="invalid"){
          let alert = this.alertCtrl.create({
            message: '부정확한 상품입니다.',
            buttons: [{
              text: '확인',
              handler: () => {
                this.navCtrl.setRoot(TabsPage, { class: "order", tabIndex: 0 });
              }
            }],
            cssClass: 'alert-modify-member'
          });
          alert.present();
        }
        console.log(res);
        
      },(err)=>{
        console.log(err);
      });
    }
  }

  selectedPaymentMethod(method){
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
      this.customInfo.receiverName = this.receiverName;

      if (this.receiverMobile1 == undefined || this.receiverMobile2 == undefined || this.receiverMobile3 == undefined || 
        this.receiverMobile1 == "" || this.receiverMobile2 == "" || this.receiverMobile3 == "") {

        this.customInfo.receiverMobile = undefined;
      } else {
        this.customInfo.receiverMobile = this.receiverMobile1 + "-" + this.receiverMobile2 + "-" + this.receiverMobile3;
      }

      let address1 = this.trim(this.address1);
      console.log(address1);
      
      if (address1 == "" || address1 == undefined) {
        this.customInfo.receiverAddress = undefined;
      } else {
        this.customInfo.receiverAddress = address1 + " " + this.trim(this.address2) + " " + this.trim(this.address3);
        this.customInfo.receiverAddress = this.trim(this.customInfo.receiverAddress);
      }

      this.orderInfo.customInfo = this.customInfo;
    }else{
      console.log("error selectDeliveryType in enterMemberOrderInfo()");
    }
  }

  enterNonMemberOrderInfo(){
    this.customInfo.ordererName = this.ordererName;
    if(this.ordererMobile1 == undefined || this.ordererMobile2 == undefined || this.ordererMobile3 == undefined){
      this.customInfo.ordererMobile = undefined;
    }else{
      this.customInfo.ordererMobile = this.ordererMobile1 + "-" + this.ordererMobile2 + "-" + this.ordererMobile3;  
    }
    
    this.customInfo.ordererEmail =  this.ordererEmail;
    this.customInfo.receiverName = this.receiverName;
    
    if (this.receiverMobile1 == undefined || this.receiverMobile2 == undefined || this.receiverMobile3 == undefined) {
      this.customInfo.receiverMobile = undefined;
    } else {
      this.customInfo.receiverMobile = this.receiverMobile1 + "-" + this.receiverMobile2 + "-" + this.receiverMobile3;
    }

    let address1 = this.trim(this.address1);
    console.log(address1);
    if(address1 == "" || address1 == undefined){
      this.customInfo.receiverAddress = undefined;
    }else{
      this.customInfo.receiverAddress = address1 + " " + this.trim(this.address2) + " " + this.trim(this.address3);
      this.customInfo.receiverAddress = this.trim(this.customInfo.receiverAddress);
    }

    this.orderInfo.customInfo = this.customInfo;
  }

  trim(str) {
    if(str!=undefined){
      return str.replace(/(^\s*)|(\s*$)/gi, "");
    }else{
      return "";
    }
  }

  nameCheck(name){
    if (name == undefined) {
      let alert = this.alertCtrl.create({
        message: '이름을 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    let pattern = /^[가-힣a-zA-Z]+$/;
    name = this.trim(name);

    if (pattern.test(name) == false) {
      let alert = this.alertCtrl.create({
        message: '정확한 이름을 입력하세요',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    return true;
  }

  addrCheck(addr){
    if(addr == undefined){
      let alert = this.alertCtrl.create({
        message: '배송지를 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    let pattern = /^[가-힣a-zA-Z][.]+$/;

    if ((addr.length < 4) && (pattern.test(addr) == false)){
      let alert = this.alertCtrl.create({
        message: '정확한 배송지를 입력하세요',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    return true;
  }
  
  mobileCheck(mobile){
    if (mobile == undefined) {
      let alert = this.alertCtrl.create({
        message: '휴대폰을 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    let pattern = /^(010|011|016|017|018|019)-[0-9]{3,4}-[0-9]{4}$/;
  
    if (pattern.test(mobile) == false) {
      let alert = this.alertCtrl.create({
        message: '적합한 휴대폰 번호가 아닙니다.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    return true;
  }

  emailCheck(email){
    email = this.trim(email);

    console.log("email : " + email);
    
    if (email == "" || email == undefined) {
      return true;
    }

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
    }
    
    return true;
  }

  paymentMethodCheck(paymentMethod){
    console.log(paymentMethod);
    
    if (!(paymentMethod == "현장결제" || paymentMethod == "카드결제" || paymentMethod == "무통장입금")){
      let alert = this.alertCtrl.create({
        message: '결제수단을 클릭해주세요',
        buttons: [{
          text: '확인'
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    return true;
  }

  refreshToken() {
    this.serverProvider.validateAccessToken().then((res) => {
      if (res == 'success') {
        return true;
      } else {
        return false;
      }
    }, err => {
      console.log(err);

      let alert = this.alertCtrl.create({
        message: '세션이 만료되었습니다.',
        buttons: [{
          text: '확인',
          handler: () => {
            this.navCtrl.setRoot(TabsPage, { class: "home", tabIndex: 0 });
          }
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    });

    return false;
  }
}
