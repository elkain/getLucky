import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { StorageProvider } from '../../providers/storage/storage';

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

  shopTitle: string = "MARKET LUCKY";

  loginTabs = ["회원", "비회원"];
  loginTabsSelected;

  username: string;
  password: string;

  usernamePlaceHolder: string = "아이디";
  passwordPlaceHolder: string = "비밀번호";

  orderName:string;
  orderNumber:string;

  orderNamePlaceHolder: string = "주문자명";
  orderNumberPlaceHolder: string = "주문번호";

  findCategories = ["아이디 찾기", "비밀번호 찾기"];
  findCategorySelected;
  findLoginInfoMethod;

  arrowIconTop = "231px";

  isMember:boolean;

  showPageType : string;
  showBackbtn: boolean;
  mypageMenus = ["주문내역", "1:1 문의", "공지사항", "회원정보수정", "배송지관리"];

  orderedProducts=[
    { orderedNumber: "20181107123456", productName: "비비고 왕교자 1.05kg 외 3건", productReceiver: "이충민", paymentMethod: "신용카드", price: "35,000원", buyDate: "2018-11-07 17:55", status: "배송완료" },
    { orderedNumber: "20181108589675", productName: "진라면 멀티팩 외 7건", productReceiver: "이충민", paymentMethod: "현장수령", price: "90,000원", buyDate: "2018-11-08 19:20", status: "배송완료" }
  ];

  deliveryDesInfos=[
    { type: "기본주소", addr: "서울시 강동구 고덕로 131 (암사동, 강동롯데캐슬퍼스트아파트) 123동 1234호", receiver: "이충민", phone: "010-1234-5678" },
    { type: "사무실", addr: "서울시 강동구 성암로 11길 24 3층", receiver: "이충민", phone: "010-1234-5678" },
    { type: "매장", addr: "서울시 강동구 상암로 18길 암사럭키슈퍼", receiver: "이충민", phone: "02-441-3545" }
  ];

  

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App, public storageProvider:StorageProvider) {
    this.loginTabsSelected = this.loginTabs[0];
    this.findCategorySelected = this.findCategories[0];
    this.isMember = this.storageProvider.isMember;
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
    this.app.getRootNavs()[0].push(SignupPage, {class:"SignupPage"});
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
    this.showPageType = "mypage";
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
      this.app.getRootNavs()[0].push(SignupPage, { class: "SignupPage" });
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
}
