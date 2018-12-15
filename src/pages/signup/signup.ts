import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { StorageProvider } from '../../providers/storage/storage';
import { MemberProvider } from '../../providers/member/member';

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
  currentPasssowrd: string;
  passwordConfirm: string;
  email: string;
  emailOption: string;
 //체크
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
  memberData = { username: "", password: "", name: "", email: "", mobile: "", address: "", birth: "", sex: "" };

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, 
    public storageProvider:StorageProvider, public memberProvider:MemberProvider) {
    
    this.male = this.whiteColor;
    this.female = this.whiteColor;
    this.isMember = this.storageProvider.isMember;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');

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

      if (this.memberData.sex=="male"){
        this.selectMale();
      } else if (this.memberData.sex == "female"){
        this.selectFemale();
      }
    }else{
      this.male = this.whiteColor;
      this.female = this.whiteColor;
    }
  }

  checkIDDuplication(){
    this.checkID = true;

    let alert = this.alertCtrl.create({
      message: '아이디 중복을 체크했습니다.',
      buttons: [{
        text: '확인',
      }],
      cssClass: 'alert-modify-member'
    });
    alert.present();
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
    }
    else if (this.mobileCheckNumber == this.mobileCheckNumberConfirm) {
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
    this.memberData.sex = "male";
    this.male = this.titleColor;
    this.female = this.whiteColor;
  }

  selectFemale(){
    this.memberData.sex = "female";
    this.male = this.whiteColor;
    this.female = this.titleColor;
  }

  signupCompBtn(){
    if ((this.idCheck() && this.pwdCheck() && this.nameCheck() && this.emailChek() && this.mobileInputCheck()) != false) {
      this.enterMemberData();
      this.memberProvider.memberData = this.memberData;
      console.log(this.memberData);

      this.navCtrl.setRoot(TabsPage, { class: "signup" });
    }
  }

  presentAlert() {

    if ((this.idCheck() && this.pwdCheck() && this.nameCheck() && this.emailChek() && this.mobileInputCheck()) != false){
      let alert = this.alertCtrl.create({
        message: '회원정보가 수정되었습니다.',
        buttons: [{
            text:'확인',
            handler:()=>{
                this.enterMemberData();
                this.memberProvider.memberData = this.memberData;
                this.navCtrl.setRoot(TabsPage, { class: "signup" });
            }
          }],
        cssClass:'alert-modify-member'
      });
      alert.present();
    }
  }

  enterMemberData(){
    let email = this.email + "@" + this.emailOption;
    email = this.trim(email);

    let address = this.password + " " + this.address2 + " " + this.address3;
    address = this.trim(address);

    let birth = this.birthYear + "-" + this.birthMonth + "-" + this.birthDay;

    this.storageProvider.isMember = true;
    this.memberData.username = this.trim(this.memberData.username);
    this.memberData.password = this.trim(this.password);
    this.memberData.name = this.trim(this.memberData.name);
    this.memberData.email = email;
    this.memberData.mobile = this.memberData.mobile;
    this.memberData.address = address;
    this.memberData.birth = birth;
    this.memberData.sex = this.memberData.sex;
  }

  trim(str) {
    if(str!=undefined){
      return str.replace(/(^\s*)|(\s*$)/gi, "");
    }else{
      return undefined;
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
    
    if (this.password.length < 6) {

      let alert = this.alertCtrl.create({
        message: '비밀번호는 6글자 이상어야합니다.',
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

    if (this.mobile1.toString().length < 3 || this.mobile2.toString().length < 3 || this.mobile3.toString().length < 4) {

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
}
