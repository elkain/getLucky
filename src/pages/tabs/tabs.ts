import { Component, ViewChild } from '@angular/core';
import { Tabs, NavController, NavParams, AlertController } from 'ionic-angular';
import { CategoryPage } from '../category/category';
import { SearchPage } from '../search/search';
import { MypagePage } from '../mypage/mypage';
import { HomePage } from '../home/home';
import { ShoppingbasketPage } from '../shoppingbasket/shoppingbasket';
import { OrderDetailPage } from '../order-detail/order-detail';
import { OrderCompletePage } from '../order-complete/order-complete';
import { SignupCompletePage } from '../signup-complete/signup-complete';
import { ServerProvider } from '../../providers/server/server';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CategoryPage;
  tab3Root = SearchPage;
  tab4Root = MypagePage;
  tab5Root = ShoppingbasketPage;
  tab6Root = OrderCompletePage;
  tab7Root = OrderDetailPage;
  tab8Root = SignupCompletePage;
  
  @ViewChild('myTabs') tabRef: Tabs;

  selectedTab:number;
  tabParams:number;
  showHeader:boolean;
  shopTitle = "MARKET LUCKY";

  childParam= {category:{}, homeSegmentCategory:0, class:"TasPage", subCategory:"" , orderedNumber:""};

  constructor(public navCtrl: NavController, public navParams:NavParams, private serverProvider:ServerProvider, public alertCtrl:AlertController) {
    this.tabParams = navParams.get("tabIndex");
    this.childParam.category = navParams.get("category");
    this.childParam.subCategory = navParams.get("subCategory");
    this.childParam.homeSegmentCategory = navParams.get("homeSegmentCategory");
    this.childParam.orderedNumber = navParams.get("orderedNumber");
    this.childParam.class = navParams.get("class");
  }

  public onTabsChange() {
    this.refreshToken();
    this.selectedTab = this.tabRef.getSelected().index;

    if (this.selectedTab == 2 || this.selectedTab == 4 || this.selectedTab == 3){
      this.showHeader = false;
    }else{
      this.showHeader = true;
    }

    if (this.tabParams != undefined) {
      this.tabRef.select(this.tabParams);
      this.tabParams=undefined;
    }
  }
  
  moveToHome(){
    if(this.selectedTab==0){
      this.childParam.homeSegmentCategory = 0; 
    }
    this.tabRef.select(0);
  }

  back() {
    this.refreshToken();
    if(this.childParam.class == "mypage"){
      this.childParam.class = "orderDetail";
      this.tabRef.select(3);
    }else{
      this.childParam.class = undefined;
      this.tabRef.select(5);
    }
    
  }

  goToShoppingBasket(){
    this.tabRef.select(4);
  }

  refreshToken() {
    this.serverProvider.validateAccessToken().then((res) => {
      if (res == 'success') {
        return true;
      } else {
        return false;
      }
    }, err => {
      console.log(err);

      let alert = this.alertCtrl.create({
        message: '세션이 만료되었습니다.',
        buttons: [{
          text: '확인',
          handler: () => {
            this.tabRef.select(0);
          }
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    });

    return false;
  }
}
