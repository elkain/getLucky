import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { MemberProvider } from '../../providers/member/member';
import { OrderProvider } from '../../providers/order/order';
import { TabsPage } from '../tabs/tabs';
import { OrderPage } from '../order/order';
import { ServerProvider } from '../../providers/server/server';
import { Storage } from '@ionic/storage';

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
  shopTitle:string;

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
  memberData = {UID:"", username:"", password:"", name: "", email:"", mobile:"", address:"", birth:"", sex:"", level:0, totalPurchase:0};
  //memberData = {};
  findMemberData = { username: "", name: "", email: "", mobile: "", type: "", method: "" };
  enterMemberAddress = { memberUID:"", addressName:"", address:"", receiver:"", mobile:""};
  deliveryAddrs = [];

  findCategories = ["아이디 찾기", "비밀번호 찾기"];
  findCategorySelected;
  findLoginInfoMethod;
  nonMemberBuy;
  prevPage;

  showPageType : string;
  showBackbtn: boolean;
  mypageMenus = ["주문내역", "1:1 문의", "공지사항", "회원정보수정", "배송지관리", "로그아웃"];
  deliveryAddressMode = []; // "수정", "출력"
  deliveryAddressEnter = false;
  mobileOptionLists = [];
  arrowIconTop = "236px";

  orderInfos;
  homeParams;
  offset=0;

  headerSize = "50px";
  contentMargin = "0";

  refreshorEnable: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App, public alertCtrl:AlertController, 
    public memberProvider: MemberProvider, public orderProvider: OrderProvider, public serverProvider: ServerProvider, private storage: Storage) {

    this.homeParams = navParams.data;
    this.shopTitle = this.serverProvider.shopTitle;
    this.offset = 0;

    this.loginTabsSelected = this.loginTabs[0];
    this.findCategorySelected = this.findCategories[0];
    this.nonMemberBuy = false;
    this.isMember = this.serverProvider.isMember;
    this.autoLoginCheckbox = false;
    this.deliveryAddressEnter = false;
    this.mobileOptionLists = this.serverProvider.mobileOptionLists;

    this.refreshorEnable=false;

    //this.memberData = this.memberProvider.memberData;
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
    this.refreshorEnable = false;
    this.offset = 0;
    if (this.isMember == true){
      if (this.homeParams.class == "orderDetail") {
        this.showPageType = "주문내역";
        this.contentMargin = "48px";
        this.headerSize = "48px";
        console.log(this.showPageType);
        this.homeParams.class = undefined;
      }else{
        this.contentMargin = "0";
        this.headerSize = "50px";
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
    this.arrowIconTop = "187px";
    this.findLoginInfoMethod = 'phone';
    this.deliveryAddressEnter = false;

    console.log('ionViewDidLoad MypagePage' + this.showPageType);
  }

  loginTabChange(Category){
    let idx = this.loginTabs.indexOf(Category);
    this.loginTabsSelected = this.loginTabs[idx];
  }

  moveToSignup(){
    this.refreshToken();
    this.app.getRootNavs()[0].push(SignupPage, {class:"mypage", prevPage:this.prevPage});
  }

  findCategoryChange(Category) {
    let idx = this.findCategories.indexOf(Category);
    this.findCategorySelected = this.findCategories[idx];

    if (this.findCategorySelected == this.findCategories[0]) {
      this.arrowIconTop = "187px";
    } else if (this.findCategorySelected == this.findCategories[1]) {
      this.arrowIconTop = "236px"; 
    }
  }

  idCheck(){
    if (this.username == undefined) {
      let alert = this.alertCtrl.create({
        message: '아이디를 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    this.username = this.trim(this.username);

    if (this.username.length < 3) {
      let alert = this.alertCtrl.create({
        message: '아이디는 세글자 이상입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    let pattern = /^[^_][a-zA-Z0-9_]+$/;

    if (pattern.test(this.username) == false) {
      let alert = this.alertCtrl.create({
        message: '정확한 아이디형식을 입력하세요',
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

  pwdCheck(){
    if (this.password == undefined) {

      let alert = this.alertCtrl.create({
        message: '비밀번호를 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    if (this.password.length < 6) {

      let alert = this.alertCtrl.create({
        message: '비밀번호는 6글자 이상입력하세요.',
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

  login(){
    if (this.idCheck() == false || this.pwdCheck() == false) {
      
    } else {
      this.serverProvider.login(this.username, this.password).then((res: any) => {
        console.log(res);

        if(res == "success"){
          if (this.nonMemberBuy != true){
            this.showPageType = "mypage";  
          }else{
            this.app.getRootNavs()[0].setRoot(OrderPage, { class: this.prevPage }).then(() => {
              this.prevPage = undefined;
            });
          }
          this.isMember = true;

          for (let i in this.memberData) {
            for (let j in this.memberProvider.memberData) {
              if (i == j) {
                this.memberData[i] = this.memberProvider.memberData[j];
              }
            }
          }
        }
      },(err)=>{
          let alert = this.alertCtrl.create({
            message: '아이디/비번이 틀립니다.',
            buttons: [{
              text: '확인',
            }],
            cssClass: 'alert-modify-member'
          });
          alert.present();
      });
    }

    this.password = undefined;
  }

  changeIdPwdFind(type){
    this.refreshToken();
    this.showPageType="find";
    let idx = this.findCategories.indexOf(type);
    this.findCategorySelected = this.findCategories[idx];
    
    if (this.findCategorySelected == this.findCategories[0]) {
      this.arrowIconTop = "187px";
    } else if (this.findCategorySelected == this.findCategories[1]) {
      this.arrowIconTop = "236px";
    }
  }

  checkFindLogintype(type){
    this.findLoginInfoMethod = type;
  }

  menuSelected(menu){
    
    if( menu == "로그아웃"){
      this.isMember = false;
      this.serverProvider.isMember = false;
      this.memberProvider.logout();
      this.autoLoginCheckbox = false;
      this.storage.set('autoLoginCheckbox', this.autoLoginCheckbox);
      this.storage.set('username', null);
      this.storage.set('password', null);
      window.location.reload();
    }else if (menu == "회원정보수정") {
      this.refreshToken();
      this.refreshorEnable = false;
      this.app.getRootNavs()[0].push(SignupPage, { class: "mypage" });
    }else{
      this.refreshToken();
      this.showPageType = menu;
      this.headerSize = "50px";
      this.contentMargin = "0";
      this.refreshorEnable = false;

      if (this.showPageType == "배송지관리"){
        if (this.memberProvider.deliveryAddrs != undefined || this.memberProvider.deliveryAddrs != null){
          this.deliveryAddrs = JSON.parse(JSON.stringify(this.memberProvider.deliveryAddrs));

          for (let i in this.memberProvider.deliveryAddrs) {
            this.deliveryAddressMode[i] = "출력";
          }
        }
      }else if(menu == "주문내역"){
        this.headerSize = "98px";
        this.contentMargin = "48px";
        this.orderInfos = this.orderProvider.orderInfos;
        this.refreshorEnable = true;
      }
      this.showBackbtn = true;
    }
  }

  moveToHome() {
    this.refreshToken();
    this.navCtrl.parent.select(0);
  }

  goToShoppingBasket(){
    this.refreshToken();
    this.navCtrl.parent.select(4);
  }

  back() {
    this.refreshToken();
    this.showPageType = "mypage";
    this.headerSize = "50px";
    this.contentMargin = "0px";
    this.showBackbtn = false;
    this.deliveryAddressEnter = false;
    this.refreshorEnable = false;
  }

  ionSelected(){
    console.log("ionSelected on mypage");
    if (this.isMember==true){
      this.showPageType = "mypage";
      this.headerSize = "50px";
      this.contentMargin = "0px";
    }else{
      this.showPageType = "login";
    }
  }

  goToOrderDetail(orderedNumber) {
    this.serverProvider.loadOrderDetail(orderedNumber, null).then((res:any)=>{
      if(res == "success"){
        this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 6, class: "mypage", orderedNumber: orderedNumber });
      }
    },(err)=>{
      console.log(err);
      if(err == 'expired'){
        let alert = this.alertCtrl.create({
          message: '세션이 만료되었습니다.',
          buttons: [{
            text: '확인',
            handler: () => {
              this.navCtrl.parent.select(0);
            }
          }],
          cssClass: 'alert-modify-member'
        });
        alert.present();
      }
    });
  }

  goToOrder() {
    this.refreshToken();
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

    this.findMemberData.name = this.name;
    this.findMemberData.username = this.username;
    this.findMemberData.email = this.email;
    this.findMemberData.mobile = mobile;
    this.findMemberData.method = this.findLoginInfoMethod;
    this.findMemberData.type = this.findCategorySelected;

    this.serverProvider.findMemberData(this.findMemberData).then((res:any)=>{
      let result = res;
      if(result.result == "success"){
        if (this.findMemberData.type == "아이디 찾기") {
          let alert = this.alertCtrl.create({
            message: '아이디는 ' + result.memberID + ' 입니다.',
            buttons: [{
              text: '확인',
              handler: () => {
                this.showPageType = "login";
              }
            }],
            cssClass: 'alert-modify-member'
          });
          alert.present();
        } else if (this.findMemberData.type == "비밀번호 찾기") {
          console.log(result.password);
          let alert = this.alertCtrl.create({
            message: '새로 설정된 비밀번호는 ' + result.password + ' 입니다.',
            buttons: [{
              text: '확인',
              handler: () => {
                this.showPageType = "login";
              }
            }],
            cssClass: 'alert-find-memberPwd'
          });
          alert.present();
        }
      }else{
        let alert = this.alertCtrl.create({
          message: '아이디/비밀번호를 찾을 수 없습니다.',
          buttons: [{
            text: '확인',
          }],
          cssClass: 'alert-modify-member'
        });
        alert.present();
      }
    }, (err)=>{
      console.log("서버 통신 실패");
              
    });
  }

  trim(str) {
    if (str != undefined) {
      return str.replace(/(^\s*)|(\s*$)/gi, "");
    } else {
      return "";
    }
  }

  addDeliveryAddr(){
    this.deliveryAddressEnter = true;
  }

  compAddDeliveryAddr() {
    if(this.enterMemberAddress.addressName != "" && this.enterMemberAddress.address != "" && this.enterMemberAddress.mobile !="" && this.enterMemberAddress.receiver != ""){
      this.enterMemberAddress.memberUID = this.memberData['UID'];
      this.serverProvider.alterDeliveryAddr(this.enterMemberAddress, "add").then((res:any)=>{
        console.log(res);
        this.deliveryAddrs = JSON.parse(JSON.stringify(this.memberProvider.deliveryAddrs));
        this.deliveryAddressEnter = false;  
        this.deliveryAddressMode[this.deliveryAddrs.length-1] = '출력';
        this.enterMemberAddress = { memberUID:"", addressName: "", address: "", mobile: "", receiver:"" };
      },(err)=>{
        console.log(err);
      });
    }else{
      let alert = this.alertCtrl.create({
        message: '배송지 정보를 모두 채워주세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    }
  }

  cancelAddDeliverAddr(){
    this.deliveryAddressEnter = false;
  }

  modifyDeliveryAddr(index){
    this.deliveryAddressMode[index] = "수정";
  }

  DelDeliveryAddr(addr){
    let index = this.deliveryAddrs.indexOf(addr);
    this.serverProvider.alterDeliveryAddr(addr, "del").then((res: any) => {
      console.log(res);
      this.deliveryAddrs = JSON.parse(JSON.stringify(this.memberProvider.deliveryAddrs));
      this.deliveryAddressMode[index] = "출력";
    }, (err) => {
      console.log(err);
    });
  }

  cancelModifyAddr(index){
    this.deliveryAddrs[index] = JSON.parse(JSON.stringify(this.memberProvider.deliveryAddrs[index]));
    this.deliveryAddressMode.splice(index,1);
  }

  compModifyAddr(index, addr){
    if (addr.addressName != "" && addr.address != "" && addr.mobile != "" && addr.receiver != ""){
      this.serverProvider.alterDeliveryAddr(addr, "modify").then((res: any) => {
        console.log(res);
        this.deliveryAddressMode[index] = "출력";
        this.deliveryAddrs = JSON.parse(JSON.stringify(this.memberProvider.deliveryAddrs));
      }, (err) => {
          console.log(err);
      });
      
    }else{
      let alert = this.alertCtrl.create({
        message: '배송지 정보를 모두 채워주세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    }
  }

  nonMemberOrderDetail(){
    this.serverProvider.loadOrderDetail(this.orderNumber, this.orderName).then((res: any) => {
      if (res == "success") {
        this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 6, class: "mypage", orderedNumber: this.orderNumber });
      }else if(res == "noItem"){
        let alert = this.alertCtrl.create({
          message: '검색된 상품이 없습니다.',
          buttons: [{
            text: '확인',
          }],
          cssClass: 'alert-modify-member'
        });
        alert.present();
      }else{
        console.log("nonMember order Detail error");
      }
    }, (err) => {
      console.log(err);
      let alert = this.alertCtrl.create({
        message: '세션이 만료되었습니다.',
        buttons: [{
          text: '확인',
          handler: () => {
            this.navCtrl.parent.select(0);
          }
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    });
  }

  doRefresh(event) {
    console.log('Begin async operation');
    
    if(this.showPageType=="주문내역"){
      this.serverProvider.loadOrderInfo().then((res: any) => {
        if (res == "success") {
          this.orderInfos = this.orderProvider.orderInfos;
          event.complete();
        }
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    }else{
      this.refreshorEnable = false;
    }
  }

  doPulling(refresher) {
    console.log('DOPULLING', refresher.progress);
    if(this.showPageType=="주문내역"){
      if (refresher.progress < 0.15) {
        refresher.cancel();
      }
    }else{
      this.refreshorEnable=false;
      refresher.cancel();
    }
    
  }

  loadData(event){
    this.offset += 20;
    this.serverProvider.loadOrderInfo(this.offset).then((res: any) => {
      if (res == "success") {
        this.orderInfos = this.orderProvider.orderInfos;
        event.complete();
      }
      console.log(res);
    }, (err) => {
      console.log(err);
    });
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
            this.navCtrl.parent.select(0);
          }
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    });

    return false;
  }
}

