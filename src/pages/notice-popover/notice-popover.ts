import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the NoticePopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notice-popover',
  templateUrl: 'notice-popover.html',
})
export class NoticePopoverPage {

  class:string;
  type:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.class = this.navParams.get("class");
    this.type = this.navParams.get("type");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticePopoverPage');
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
