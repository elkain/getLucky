import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { SelectPopoverPage } from '../select-popover/select-popover';
import { TabsPage } from '../tabs/tabs';

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

  deliveryCategorySelected;
  basicPlaceStyle;
  newPlaceStyle;
  showDeliveryInfo:boolean=true;
  showProductInfo:boolean=true;
  showPaymentInfo:boolean=true;
  showPaymentMethodInfo: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
    this.deliveryCategorySelected='basicPlace';
    this.basicPlaceStyle = { 'select-segment': true, 'unselect-segment': false};
    this.newPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  selectBasicPlaceSegment(){
    this.basicPlaceStyle = { 'select-segment': true, 'unselect-segment': false };
    this.newPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
    this.deliveryCategorySelected="basicPlace";
    console.log(this.deliveryCategorySelected);
    
  }

  selectNewPlaceSegment(){
    this.basicPlaceStyle = { 'select-segment': false, 'unselect-segment': true };
    this.newPlaceStyle = { 'select-segment': true, 'unselect-segment': false };
    this.deliveryCategorySelected = "newPlace";
    console.log(this.deliveryCategorySelected);
  }

  hideDeliveryInfo(){
    console.log("button click");
    
    if(this.showDeliveryInfo==true){
      this.showDeliveryInfo=false;
    } else if (this.showDeliveryInfo == false){
      this.showDeliveryInfo = true;
    } else{
      console.log("ShowDeliveryInfo error");
    }
  }

  hideProductInfo(){
    console.log("button click", this.showProductInfo);

    if (this.showProductInfo == true) {
      this.showProductInfo = false;
    } else if (this.showProductInfo == false) {
      this.showProductInfo = true;
    } else {
      console.log("showProductInfo error");
    }
  }

  hidePaymentInfo(){
    console.log("button click", this.showPaymentInfo);

    if (this.showPaymentInfo == true) {
      this.showPaymentInfo = false;
    } else if (this.showPaymentInfo == false) {
      this.showPaymentInfo = true;
    } else {
      console.log("showPaymentInfo error");
    }
  }

  hidePaymentMethodInfo() {
    console.log("button click", this.showPaymentMethodInfo);

    if (this.showPaymentMethodInfo == true) {
      this.showPaymentMethodInfo = false;
    } else if (this.showPaymentMethodInfo == false) {
      this.showPaymentMethodInfo = true;
    } else {
      console.log("showPaymentInfo error");
    }
  }

  presentPopover() {
    const popover = this.popoverCtrl.create(SelectPopoverPage, {}, { cssClass:'delivery-popover'});
    popover.present();
  }

  moveToHome() {
    this.navCtrl.setRoot(TabsPage);
  }
}
