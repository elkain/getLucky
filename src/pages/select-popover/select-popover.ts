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

    this.deliveryAddrs = this.navParams.get("addressLists");
    if (this.deliveryAddrs.length!=0){
      this.deliveryAddrs[0].select = true;
      this.deliveryAddrs[0].color = this.deliveryAddrSelectedColor;
      this.deliveryAddrSelected = this.deliveryAddrs[0];

      for (var i = 1; i < this.deliveryAddrs.length; i++) {
        this.deliveryAddrs[i].select = false;
        this.deliveryAddrs[i].color = this.deliveryAddrUnselectedColor;
      }
    }else{
      this.deliveryAddrs = [];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPopoverPage');
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
    this.viewCtrl.dismiss(null);
  }

  confirm(){
    if (this.deliveryAddrSelected!=undefined){
      let idx = this.deliveryAddrs.indexOf(this.deliveryAddrSelected);
      this.viewCtrl.dismiss(idx);
    }else{
      this.viewCtrl.dismiss(null);
    }
  }
}
