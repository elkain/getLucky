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
  id;
  name;
  email;
  emailOption;
  phone1;
  phone2;
  phone3;
  birthYear;
  birthMonth;
  birthDay;
  sex;
  male;
  female;

  customerInfo;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public storageProvider:StorageProvider) {
    this.male = this.whiteColor;
    this.female = this.whiteColor;
    this.isMember = this.storageProvider.isMember;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    if (this.isMember==true){
      this.customerInfo = { id: "chungmin93", name:"이충민" , email:"chungmin93@gmail.com", phone:"010-3769-4456", birth:"1985-09-03", sex:"male"};
      this.id=this.customerInfo.id;
      this.name=this.customerInfo.name;
      let emailTemp = this.customerInfo.email.split('@');
      this.email = emailTemp[0];
      this.emailOption = emailTemp[1];
      let phoneTemp = this.customerInfo.phone.split('-');
      this.phone1 = phoneTemp[0];
      this.phone2 = phoneTemp[1];
      this.phone3 = phoneTemp[2];
      let birthTemp = this.customerInfo.birth.split('-');
      this.birthDay = birthTemp[2];
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

  emailOptionChange(){
    
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
    this.storageProvider.isMember = true;
    this.navCtrl.setRoot(TabsPage, { tabIndex: 7 });
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      message: '회원정보가 수정되었습니다.',
      buttons: [{
          text:'확인',
          handler:()=>{
            this.navCtrl.setRoot(TabsPage, {class:"TabsPage"});
          }
        }],
      cssClass:'alert-modify-member'
    });
    alert.present();
  }
}
