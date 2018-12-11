import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { StorageProvider } from '../../providers/storage/storage';
import Sha from 'sha.js';
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
  username:string;
  password: string;
  currentPasssowrd: string;
  passwordConfirm: string;
  name: string;
  email: string;
  emailOption: string;
  emailOptionLists =["naver.com", "gmail.com", "daum.net", "outlook.com", "nate.com", "yahoo.com"];
  mobile1:number;
  mobile2: number;
  mobile3: number;
  address1:string;
  address2: string;
  address3: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  sex: string;
  male:string;
  female:string;
  checkID:boolean = false;
  mobileCheck:boolean = false;
  memberData: { username: string, password: string, name: string, email: string, mobile: string, address: string, birth: string, sex: string };

  customerInfo;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public storageProvider:StorageProvider) {
    this.male = this.whiteColor;
    this.female = this.whiteColor;
    this.isMember = this.storageProvider.isMember;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    if (this.isMember==true){
      //this.customerInfo = { username: "chungmin93", name:"이충민" , email:"chungmin93@gmail.com", mobile:"010-3769-4456", birth:"1985-09-03", sex:"male"};
      this.customerInfo = this.storageProvider.memberData;
      console.log(this.customerInfo);
      this.username=this.customerInfo.username;
      this.name=this.customerInfo.name;
      let emailTemp = this.customerInfo.email.split('@');
      this.email = emailTemp[0];
      this.emailOption = emailTemp[1];
      let mobileTemp = this.customerInfo.mobile.split('-');
      this.mobile1 = mobileTemp[0];
      this.mobile2 = mobileTemp[1];
      this.mobile3 = mobileTemp[2];
      let birthTemp = this.customerInfo.birth.split('-');
      this.birthYear = birthTemp[0];
      this.birthMonth = birthTemp[1];
      this.birthDay = birthTemp[2];

      if(this.customerInfo.sex=="male"){
        this.selectMale();
      } else if (this.customerInfo.sex == "female"){
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

  emailOptionChange(){
    
  }

  recieveMobileConfirm(){

  }

  confirmMobile(){
    this.mobileCheck = true;

    let alert = this.alertCtrl.create({
      message: '인증번호를 확인했습니다.',
      buttons: [{
        text: '확인',
      }],
      cssClass: 'alert-modify-member'
    });
    alert.present();
  }

  findAddr(){

  }

  selectMale(){
    this.sex = "male";
    this.male = this.titleColor;
    this.female = this.whiteColor;
  }

  selectFemale(){
    this.sex = "female";
    this.male = this.whiteColor;
    this.female = this.titleColor;
  }

  signupCompBtn(){
    if(this.checkID == false){
      let alert = this.alertCtrl.create({
        message: '아이디 중복을 체크하세요',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    } else if (this.mobileCheck == false){
      let alert = this.alertCtrl.create({
        message: '모바일 인증번호를 확인하세요',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    } else{
      if(this.enterMemberData()==true){
        this.navCtrl.setRoot(TabsPage, { class: "TabsPage" });
      }
    }
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      message: '회원정보가 수정되었습니다.',
      buttons: [{
          text:'확인',
          handler:()=>{
            if (this.enterMemberData() == true) {
              this.navCtrl.setRoot(TabsPage, { class: "TabsPage" });
            }
          }
        }],
      cssClass:'alert-modify-member'
    });
    alert.present();
  }

  enterMemberData(){
    if(this.evalMemberInfo()==true) {
      console.log("username : " + this.username);
      console.log("password : " + this.password);
      console.log("name : " + this.name);

      let email = this.email + "@" + this.emailOption;
      email = this.trim(email);
      console.log("email : " + email);

      let mobile = this.mobile1 + "-" + this.mobile2 + "-" + this.mobile3;
      console.log("mobile : " + mobile);

      let address = this.password + " " + this.address2 + " " + this.address3;
      address = this.trim(address);
      console.log("address : " + address);

      let birth = this.birthYear + "-" + this.birthMonth + "-" + this.birthDay;
      console.log("birth : " + birth);

      this.storageProvider.isMember = true;
      this.storageProvider.memberData.username = this.trim(this.username);
      this.storageProvider.memberData.password = this.trim(this.password);
      this.storageProvider.memberData.name = this.trim(this.name);
      this.storageProvider.memberData.email = email;
      this.storageProvider.memberData.mobile = mobile;
      this.storageProvider.memberData.address = address;
      this.storageProvider.memberData.birth = birth;
      this.storageProvider.memberData.sex = this.sex;

      return true;
    }else{
      return false;
    }
  }

  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/gi, "");
  }

  evalMemberInfo(){
  
    let flag = true;

    if (this.username == undefined) {
      flag = false;

      let alert = this.alertCtrl.create({
        message: '아이디를 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
      
    } else if (this.username.length < 3){
      flag = false;

      let alert = this.alertCtrl.create({
        message: '아이디는 세글자 이상입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

    }else if (this.password == undefined) {
      flag = false;

      let alert = this.alertCtrl.create({
        message: '비밀번호를 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

    } else if (this.username.length < 6) {
      flag = false;

      let alert = this.alertCtrl.create({
        message: '비밀번호는 6글자 이상입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

    }else if (this.passwordConfirm == undefined) {
      flag = false;

      let alert = this.alertCtrl.create({
        message: '비밀번호를 확인해주세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

    }else if (this.password !== this.passwordConfirm){
      flag = false;
      
      let alert = this.alertCtrl.create({
        message: '비밀번호가 일치하지 않습니다.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

    }else if(this.password.length <6 ){
      flag = false;

      let alert = this.alertCtrl.create({
        message: '비밀번호는 6글자 이상어야합니다.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();

    }else if (this.name == undefined){
      flag = false;

      let alert = this.alertCtrl.create({
        message: '이름을 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    }else if(this.email == undefined || this.emailOption == undefined){
      flag = false;

      let alert = this.alertCtrl.create({
        message: '이메일을 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    }else if (this.mobile1 == undefined || this.mobile2 == undefined || this.mobile3 == undefined ) {
      flag = false;

      let alert = this.alertCtrl.create({
        message: '휴대폰을 입력하세요.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    } else if (this.mobile1.toString().length <3 || this.mobile2.toString().length < 3 || this.mobile3.toString().length<4){
      flag = false;

      let alert = this.alertCtrl.create({
        message: '적합한 휴대폰 번호가 아닙니다.',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    }

    if(flag==true){
      return true;
    }else{
      return false;
    }
  }
}
