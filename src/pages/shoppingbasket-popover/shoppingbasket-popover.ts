import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the ShoppingbasketPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shoppingbasket-popover',
  templateUrl: 'shoppingbasket-popover.html',
})
export class ShoppingbasketPopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private app:App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingbasketPopoverPage');
  }

  keepShopping() {
    this.viewCtrl.dismiss().then(()=>{
      let param = this.navParams.get("class");
      
      if(param == "buy"){
        this.app.getRootNavs()[0].push(TabsPage, { class: "shoppingbasket-popover", tabIndex: 0});
      }
    });
  }

  confirm() {
    this.viewCtrl.dismiss().then(()=>{
      this.app.getRootNavs()[0].push(TabsPage, {class:"shoppingbasket-popover", tabIndex:4});
    });
  }
}
