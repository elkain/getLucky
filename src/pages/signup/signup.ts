import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { StorageProvider } from '../../providers/storage/storage';

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
    this.checkID=true;
  }

  emailOptionChange(){
    
  }

  recieveMobileConfirm(){

  }

  confirmMobile(){
    this.mobileCheck = true;
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
      this.enterMemberData();      
      this.navCtrl.setRoot(TabsPage, { tabIndex: 7 });
    }
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      message: '회원정보가 수정되었습니다.',
      buttons: [{
          text:'확인',
          handler:()=>{
            this.enterMemberData();
            this.navCtrl.setRoot(TabsPage, {class:"TabsPage"});
          }
        }],
      cssClass:'alert-modify-member'
    });
    alert.present();
  }

  enterMemberData(){
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
    this.storageProvider.memberData.username = this.username;
    this.storageProvider.memberData.password = this.password;
    this.storageProvider.memberData.name = this.name;
    this.storageProvider.memberData.email = email;
    this.storageProvider.memberData.mobile = mobile;
    this.storageProvider.memberData.address = address;
    this.storageProvider.memberData.birth = birth;
    this.storageProvider.memberData.sex = this.sex;
  }

  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/gi, "");
  }

  checkPassowrd(){
    
  }
}
