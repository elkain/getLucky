import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { MemberProvider } from '../../providers/member/member';
import { NoticePopoverPage } from '../notice-popover/notice-popover';
import { OrderPage } from '../order/order';
import { ServerProvider } from '../../providers/server/server';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  titleColor = "#3498DB";
  whiteColor = "#ffffff";

  isMember: boolean = false;
  password: string;
  currentPasssoword: string;
  passwordConfirm: string;
  email: string;
  emailOption: string;
  mobile1: string;
  mobile2: string;
  mobile3: string;
  address1:string;
  address2: string;
  address3: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  sex: string;
  male:string;
  female:string;
  checkID:boolean = false;
  mobileCheck:boolean = false;
  mobileCheckNumber: number = undefined;
  mobileCheckNumberConfirm: number = undefined;
  memberData = { UID: "", username: "", password: "", name: "", email: "", mobile: "", address: "", birth: "", sex: "" };
  emailOptionLists = [];
  checkServicePolicy = false;
  checkPrivacyInfoPolicy = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, 
    public memberProvider: MemberProvider, public serverProvider: ServerProvider, public popoverCtrl: PopoverController) {
    this.male = this.whiteColor;
    this.female = this.whiteColor;
    this.isMember = this.serverProvider.isMember;
    this.emailOptionLists = this.serverProvider.emailOptionLists;
    this.emailOption = this.emailOptionLists[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    this.isMember = this.serverProvider.isMember;

    if (this.isMember==true){
      this.memberData = this.memberProvider.memberData;
      let emailTemp = this.memberData.email.split('@');
      this.email = emailTemp[0];
      this.emailOption = emailTemp[1];
      let mobileTemp = this.memberData.mobile.split('-');
      this.mobile1 = mobileTemp[0];
      this.mobile2 = mobileTemp[1];
      this.mobile3 = mobileTemp[2];
      let birthTemp = this.memberData.birth.split('-');
      this.birthYear = birthTemp[0];
      this.birthMonth = birthTemp[1];
      this.birthDay = birthTemp[2];

      if (this.memberData.sex=="m"){
        this.selectMale();
      } else if (this.memberData.sex == "f"){
        this.selectFemale();
      }
    }else{
      this.male = this.whiteColor;
      this.female = this.whiteColor;
    }
  }

  checkIDDuplication(){

    this.serverProvider.checkIDDuplication(this.memberData.username).then((res:any)=>{
      if(res=="none"){
        this.checkID = true;
        let alert = this.alertCtrl.create({
          message: '아이디 생성 가능합니다.',
          buttons: [{
            text: '확인',
          }],
          cssClass: 'alert-modify-member'
        });
        alert.present();
      }
    }, (err)=>{
        let alert = this.alertCtrl.create({
          message: '중복된 아이디 입니다.',
          buttons: [{
            text: '확인',
          }],
          cssClass: 'alert-modify-member'
        });
        alert.present();
    });
  }

  recieveMobileConfirm(){
    this.mobileCheckNumber = 123456;

    let alert = this.alertCtrl.create({
      message: '인증번호 : ' + this.mobileCheckNumber,
      buttons: [{
        text: '확인',
      }],
      cssClass: 'alert-modify-member'
    });
    alert.present();
  }

  confirmMobile(){
    if (this.mobileCheckNumberConfirm == undefined){
      let alert = this.alertCtrl.create({
        message: '인증번호를 입력해주세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    } else if (this.mobileCheckNumber == this.mobileCheckNumberConfirm) {
      let alert = this.alertCtrl.create({
        message: '인증번호를 확인했습니다.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      this.memberData.mobile = this.trim(this.mobile1) + "-" + this.trim(this.mobile2) + "-" + this.trim(this.mobile3);
      this.mobileCheck = true;
    } else {
      let alert = this.alertCtrl.create({
        message: '인증번호가 틀립니다.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    }
  }

  findAddr(){

  }

  selectMale(){
    this.memberData.sex = "m";
    this.male = this.titleColor;
    this.female = this.whiteColor;
  }

  selectFemale(){
    this.memberData.sex = "f";
    this.male = this.whiteColor;
    this.female = this.titleColor;
  }

  signupCompBtn(){
    if(this.checkServicePolicy == false){
      let alert = this.alertCtrl.create({
        message: '이용약관에 동의해주세요',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    }else if (this.checkPrivacyInfoPolicy == false) {
      let alert = this.alertCtrl.create({
        message: '개인정보 처리 방침에 동의해주세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    }else if ((this.idCheck() && this.pwdCheck() && this.nameCheck() && this.emailChek() && this.mobileInputCheck() && this.birthCheck()) != false) {
      this.enterMemberData();
      this.password = "";
      this.passwordConfirm = "";
      this.serverProvider.signup(this.memberData).then((res:any)=>{
        if(res == "success"){
          this.memberProvider.memberData = this.memberData;
          this.serverProvider.isMember = true;
          let prevPage = this.navParams.get("prevPage");
          if (prevPage == "buy" || prevPage == "shoppingbasket") {
            this.navCtrl.push(OrderPage, { class: "buy" });
          } else {
            this.navCtrl.setRoot(TabsPage, { class: "signup" });
          }
        }
      },(err)=>{
        console.log("signup failed");
      });
    }
  }

  // 회원 정보 수정 버튼
  presentAlert() {
    if ((this.modifyPwdCheck() && this.nameCheck() && this.emailChek() && this.modifyMobileNumber() && this.birthCheck()) != false){
      this.enterMemberData();
      this.serverProvider.modify(this.memberData, this.currentPasssoword).then((res:any)=>{
        if(res == "success"){
          let alert = this.alertCtrl.create({
            message: '회원정보가 수정되었습니다.',
            buttons: [{
              text: '확인',
              handler: () => {
                this.navCtrl.setRoot(TabsPage, { class: "signup" });
              }
            }],
            cssClass: 'alert-modify-member'
          });
          alert.present();  
        }
      }, (err) => {
        if(err == 'failed'){
          let alert = this.alertCtrl.create({
            message: '아이디/비번이 틀립니다.',
            buttons: [{
              text: '확인',
            }],
            cssClass: 'alert-modify-member'
          });
          alert.present();
        }else{
          let alert = this.alertCtrl.create({
            message: '세션이 만료되었습니다.',
            buttons: [{
              text: '확인',
              handler: ()=>{
                this.navCtrl.setRoot(TabsPage, { class: "signup", tabIndex: 0 });
              }
            }],
            cssClass: 'alert-modify-member'
          });
          alert.present();
        }
      });
    }
  }

  enterMemberData(){
    let email = this.email + "@" + this.emailOption;

    this.address1 = this.trim(this.address1);
    this.address2 = this.trim(this.address2);
    this.address3 = this.trim(this.address3);

    let address = this.address1 + " " + this.address2 + " " + this.address3;
    address = this.trim(address);

    let birth = this.birthYear + "-" + this.birthMonth + "-" + this.birthDay;

    if(this.password != undefined){
      this.memberData.password = this.trim(this.password);
    }
    
    this.memberData.email = email;
    this.memberData.address = address;
    this.memberData.birth = birth;
  }

  trim(str) {
    if(str!=undefined){
      return str.replace(/(^\s*)|(\s*$)/gi, "");
    }else{
      return "";
    }
  }

  idCheck(){
    if (this.memberData.username == undefined) {
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

    this.memberData.username = this.trim(this.memberData.username);

    if (this.memberData.username.length < 3) {
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

    if (pattern.test(this.memberData.username) == false) {
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
    
    if (this.checkID == false) {
      let alert = this.alertCtrl.create({
        message: '아이디 중복을 체크하세요',
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
    
    if (this.passwordConfirm == undefined) {

      let alert = this.alertCtrl.create({
        message: '비밀번호를 확인해주세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }
      
    if (this.password !== this.passwordConfirm) {

      let alert = this.alertCtrl.create({
        message: '비밀번호가 일치하지 않습니다.',
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

  modifyPwdCheck(){
    if (this.currentPasssoword == undefined) {
      let alert = this.alertCtrl.create({
        message: '현재 비밀번호를 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    if (this.currentPasssoword.length < 6) {

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

    /*if (this.memberData.password != currentPasssoword) {
      let alert = this.alertCtrl.create({
        message: '현재 비밀번호가 틀렸습니다.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }*/
    
    if(this.password == undefined){
      return true;
    }else{
      return this.pwdCheck();
    }
  }

  nameCheck(){
    if (this.memberData.name == undefined) {
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
    this.memberData.name = this.trim(this.memberData.name);
    
    if (pattern.test(this.memberData.name) == false){
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

  emailChek(){
    if (this.email == undefined || this.emailOption == undefined) {

      let alert = this.alertCtrl.create({
        message: '이메일을 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }

    this.email = this.trim(this.email);
    this.emailOption = this.trim(this.emailOption);

    let emailParttern = /^[a-zA-Z0-9_\-\.]+$/;
    let emailOptionPattern = /^[a-zA-Z0-9\-]+\.[\.a-zA-Z]+$/;

    if(emailParttern.test(this.email) == false || emailOptionPattern.test(this.emailOption) == false){
      let alert = this.alertCtrl.create({
        message: '정확한 이메일주소를 입력하세요',
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

  mobileInputCheck(){
    if (this.mobile1 == undefined || this.mobile2 == undefined || this.mobile3 == undefined) {

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

    let firstPattern = /^(010|011|016|017|018|019)/;
    let middlePattern = /^[0 - 9]{ 3, 4}$/;
    let lastPatern = /^[0 - 9]{4}$/;

    if (firstPattern.test(this.mobile1) == false && middlePattern.test(this.mobile2) == false && lastPatern.test(this.mobile3) == false) {
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

    if (this.mobileCheck == false) {
      let alert = this.alertCtrl.create({
        message: '모바일 인증번호를 확인하세요',
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

  modifyMobileNumber(){
    let mobile = this.mobile1 + "-" + this.mobile2 + "-" + this.mobile3;

    if (mobile != this.memberData.mobile){
      return this.mobileInputCheck();
    }

    return true;
  }

  birthCheck(){
    let yearPattern = /^[0-9]{4}$/;
    let pattern = /^[0-9]{1,2}$/;

    if (this.birthYear == undefined && this.birthMonth == undefined && this.birthDay == undefined){
      return true;
    }

    if (yearPattern.test(this.birthYear) == false || pattern.test(this.birthMonth) == false || pattern.test(this.birthDay) == false) {
      let alert = this.alertCtrl.create({
        message: '적합한 생일을 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

      return false;
    }
  }

  alertNotice(type) {
    let popover = this.popoverCtrl.create(NoticePopoverPage, { class: "home", type: type }, { cssClass: 'notice-popover' });
    popover.present();
  }
}
