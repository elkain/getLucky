import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { StorageProvider } from '../../providers/storage/storage';
import { MemberProvider } from '../../providers/member/member';
import { OrderProvider } from '../../providers/order/order';
import { TabsPage } from '../tabs/tabs';
import { OrderPage } from '../order/order';
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
  memberData = {username:"", password:"", name: "", email:"", mobile:"", address:"", birth:"", sex:"", classs:0, totalPurchase:0};

  findCategories = ["아이디 찾기", "비밀번호 찾기"];
  findCategorySelected;
  findLoginInfoMethod;
  nonMemberBuy;
  prevPage;

  showPageType : string;
  showBackbtn: boolean;
  mypageMenus = ["주문내역", "1:1 문의", "공지사항", "회원정보수정", "배송지관리"];

  arrowIconTop = "231px";

  orderInfos;
  deliveryDesInfos;         // 배송지 관리
  homeParams;

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App, public alertCtrl:AlertController, public storageProvider:StorageProvider,
    public memberProvider:MemberProvider, public orderProvider:OrderProvider) {

    this.homeParams = navParams.data;

    this.loginTabsSelected = this.loginTabs[0];
    this.findCategorySelected = this.findCategories[0];
    this.nonMemberBuy = false;
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
  }

  ionViewDidEnter() {
    if (this.isMember == true){
      if (this.homeParams.class == "orderDetail") {
        this.showPageType = "주문내역";
        console.log(this.showPageType);
        this.homeParams.class = undefined;
      }else{
        this.showPageType = "mypage";
      }
    }else{
      console.log(this.homeParams.class);
      
      if (this.homeParams.class == "buy" || this.homeParams.class == "shoppingbasket"){
        this.loginTabsSelected = this.loginTabs[1];
        this.nonMemberBuy = true;
        this.prevPage = this.homeParams.class;
        this.homeParams.class = undefined;
      }else{
        this.loginTabsSelected = this.loginTabs[0];
        this.nonMemberBuy = false;
      }
      this.showPageType = "login";
    }
    
    this.findCategorySelected = this.findCategories[0];
    this.showBackbtn = false;
    this.arrowIconTop = "183px";
    this.findLoginInfoMethod = 'phone';

    console.log('ionViewDidLoad MypagePage' + this.showPageType);
  }

  loginTabChange(Category){
    let idx = this.loginTabs.indexOf(Category);
    this.loginTabsSelected = this.loginTabs[idx];
  }

  moveToSignup(){
    this.app.getRootNavs()[0].push(SignupPage, {class:"mypage", prevPage:this.prevPage});
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

    if (this.memberData.username == this.username && this.memberData.password == this.password){
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
    }

    this.showPageType = "mypage";
    this.autoLoginCheckbox = false;
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
    this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 6, class: "mypage", orderedNumber: orderedNumber});
  }

  goToOrder() {
    this.app.getRootNavs()[0].setRoot(OrderPage, { class: this.prevPage}).then(()=>{
      this.prevPage = undefined;
    });
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

