import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the SelectPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-popover',
  templateUrl: 'select-popover.html',
})
export class SelectPopoverPage {

  deliveryAddrSelected;
  deliveryAddrs;
  deliveryAddrSelectedColor = "#d3d3d3";
  deliveryAddrUnselectedColor = "#ffffff";
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPopoverPage');
    this.deliveryAddrs = [
      { title: "기본배송지", address: "서울시 강동구 고덕로 131(암사동, 강동롯데캐슬퍼스트) 123동 1234호" },
      { title: "사무실", address: "서울시 상암로 11길 24 3층" },
      { title: "매장", address: "서울시 상암로 11길 18 암사럭키슈퍼" },
    ];

    this.deliveryAddrs[0].select = true;
    this.deliveryAddrs[0].color = this.deliveryAddrSelectedColor;
    this.deliveryAddrSelected = this.deliveryAddrs[0];

    for (var i = 1; i < this.deliveryAddrs.length; i++) {
      this.deliveryAddrs[i].select = false;
      this.deliveryAddrs[i].color = this.deliveryAddrUnselectedColor;
    }
  }

  selectDeliveryAddr(deliveryAddr){
    let idx = this.deliveryAddrs.indexOf(this.deliveryAddrSelected);
    this.deliveryAddrs[idx].select = false;
    this.deliveryAddrs[idx].color = this.deliveryAddrUnselectedColor;

    idx = this.deliveryAddrs.indexOf(deliveryAddr);
    this.deliveryAddrs[idx].select = true;
    this.deliveryAddrSelected = this.deliveryAddrs[idx];
    this.deliveryAddrs[idx].color = this.deliveryAddrSelectedColor;
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

  confirm(){
    this.viewCtrl.dismiss();
  }
}
