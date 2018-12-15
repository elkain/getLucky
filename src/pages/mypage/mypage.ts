import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { StorageProvider } from '../../providers/storage/storage';
import { MemberProvider } from '../../providers/member/member';
import { OrderProvider } from '../../providers/order/order';

/**
 * Generated class for the MypagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MypagePage {

  isMember: boolean;

  loginTabs = ["회원", "비회원"];
  loginTabsSelected;

  username: string;
  password: string;

  usernamePlaceHolder: string = "아이디";
  passwordPlaceHolder: string = "비밀번호";
  autoLoginCheckbox:boolean;

  orderName:string;
  orderNumber:string;

  orderNamePlaceHolder: string = "주문자명";
  orderNumberPlaceHolder: string = "주문번호";

  name;
  email;
  mobile1;
  mobile2;
  mobile3;
  memberData = {userName:"", password:"", name: "", email:"", mobile:"", address:"", birth:"", sex:"", classs:0, totalPurchase:0};

  findCategories = ["아이디 찾기", "비밀번호 찾기"];
  findCategorySelected;
  findLoginInfoMethod;

  showPageType : string;
  showBackbtn: boolean;
  mypageMenus = ["주문내역", "1:1 문의", "공지사항", "회원정보수정", "배송지관리"];

  arrowIconTop = "231px";

  orderedProducts=[
    { orderedNumber: "20181107123456", productName: "비비고 왕교자 1.05kg 외 3건", productReceiver: "이충민", paymentMethod: "신용카드", price: "35,000원", buyDate: "2018-11-07 17:55", status: "배송완료" },
    { orderedNumber: "20181108589675", productName: "진라면 멀티팩 외 7건", productReceiver: "이충민", paymentMethod: "현장수령", price: "90,000원", buyDate: "2018-11-08 19:20", status: "배송완료" }
  ];

  orderInfos;

  deliveryDesInfos=[
    { type: "기본주소", address: "서울시 강동구 고덕로 131 (암사동, 강동롯데캐슬퍼스트아파트) 123동 1234호", receiver: "이충민", phone: "010-1234-5678" },
    { type: "사무실", address: "서울시 강동구 성암로 11길 24 3층", receiver: "이충민", phone: "010-1234-5678" },
    { type: "매장", address: "서울시 강동구 상암로 18길 암사럭키슈퍼", receiver: "이충민", phone: "02-441-3545" }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App, public alertCtrl:AlertController, public storageProvider:StorageProvider,
    public memberProvider:MemberProvider, public orderProvider:OrderProvider) {
    this.loginTabsSelected = this.loginTabs[0];
    this.findCategorySelected = this.findCategories[0];
    this.isMember = this.storageProvider.isMember;
    this.deliveryDesInfos = this.memberProvider.deliveryAddrs;

    for(let i in this.memberData){
      for (let j in this.memberProvider.memberData){
        if(i==j){
          this.memberData[i] = this.memberProvider.memberData[j];
        }
      }
    }

    this.orderInfos = this.orderProvider.orderInfos;
    console.log(this.orderInfos);
    
  }

  ionViewDidEnter() {
    if (this.isMember == true){
      this.showPageType = "mypage";
    }else{
      this.showPageType = "login";
    }

    this.loginTabsSelected = this.loginTabs[0];
    this.findCategorySelected = this.findCategories[0];
    this.showBackbtn=false;
    this.arrowIconTop = "183px";
    this.findLoginInfoMethod = 'phone';

    console.log('ionViewDidLoad MypagePage' + this.showPageType);
  }

  loginTabChange(Category){
    let idx = this.loginTabs.indexOf(Category);
    this.loginTabsSelected = this.loginTabs[idx];
  }

  moveToSignup(){
    this.app.getRootNavs()[0].push(SignupPage, {class:"mypage"});
  }

  findCategoryChange(Category) {
    let idx = this.findCategories.indexOf(Category);
    this.findCategorySelected = this.findCategories[idx];

    if (this.findCategorySelected == this.findCategories[0]) {
      this.arrowIconTop = "183px";
    } else if (this.findCategorySelected == this.findCategories[1]) {
      this.arrowIconTop = "231px"; 
    }
  }

  login(){
    this.isMember=true;
    this.storageProvider.isMember = this.isMember;

    /*if (this.memberData.userName == this.username && this.memberData.password == this.password){
      this.showPageType = "mypage";
    }else{
      let alert = this.alertCtrl.create({
        message: '아이디/비번이 틀립니다.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    }*/

    this.showPageType = "mypage";
    
    console.log("userName : " + this.username);
    console.log("password : " + this.password);
    console.log("autoLoginCheckbox : " + this.autoLoginCheckbox);
  }

  changeIdPwdFind(type){
    this.showPageType="find";
    let idx = this.findCategories.indexOf(type);
    this.findCategorySelected = this.findCategories[idx];
    
    if (this.findCategorySelected == this.findCategories[0]) {
      this.arrowIconTop = "183px";
    } else if (this.findCategorySelected == this.findCategories[1]) {
      this.arrowIconTop = "231px";
    }
  }

  checkFindLogintype(type){
    this.findLoginInfoMethod = type;
  }

  menuSelected(menu){
    if (menu == "회원정보수정") {
      this.app.getRootNavs()[0].push(SignupPage, { class: "mypage" });
    }else{
      this.showPageType = menu;
      this.showBackbtn = true;
    }
  }

  moveToHome() {
    this.navCtrl.parent.select(0);
  }

  goToShoppingBasket(){
    this.navCtrl.parent.select(4);
  }

  back() {
    this.showPageType = "mypage";
    this.showBackbtn = false;
  }

  ionSelected(){
    console.log("ionSelected on mypage");
    if (this.isMember==true){
      this.showPageType = "mypage";
    }else{
      this.showPageType = "login";
    }
  }

  goToOrderDetail(orderedNumber) {
    console.log(orderedNumber);
    
    this.navCtrl.parent.select(6);
  }

  confirmInfoFind(){
    let mobile = this.mobile1 + "-" + this.mobile2 + "-" + this.mobile3;

    console.log(this.username);
    console.log(this.name);
    console.log(this.email);
    console.log(mobile);
    console.log(this.findLoginInfoMethod);
    console.log(this.findCategorySelected);

    this.storageProvider.findMemberData.name = this.name;
    this.storageProvider.findMemberData.username = this.username;
    this.storageProvider.findMemberData.email = this.email;
    this.storageProvider.findMemberData.mobile = mobile;
    this.storageProvider.findMemberData.method = this.findLoginInfoMethod;
    this.storageProvider.findMemberData.type = this.findCategorySelected;
  }
}

