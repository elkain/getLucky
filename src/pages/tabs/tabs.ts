import { Component, ViewChild } from '@angular/core';
import { Tabs, NavController, NavParams } from 'ionic-angular';
import { CategoryPage } from '../category/category';
import { SearchPage } from '../search/search';
import { MypagePage } from '../mypage/mypage';
import { HomePage } from '../home/home';
import { ShoppingbasketPage } from '../shoppingbasket/shoppingbasket';
import { OrderDetailPage } from '../order-detail/order-detail';
import { OrderCompletePage } from '../order-complete/order-complete';
import { SignupCompletePage } from '../signup-complete/signup-complete';

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
  
  shopTitle:string = "MARKET LUCKY";

  @ViewChild('myTabs') tabRef: Tabs;

  selectedTab;
  tabParams;
  showHeader;

  constructor(public navCtrl: NavController, public navParams:NavParams) {
    this.tabParams = navParams.get("tabIndex");
  }

  public onTabsChange() {
    this.selectedTab = this.tabRef.getSelected().index;
    
    if (this.selectedTab == 2 || this.selectedTab == 4){
      this.showHeader = false;
    }else{
      this.showHeader = true;
    }

    console.log(this.tabParams);
    
    if (this.tabParams != undefined) {
      this.tabRef.select(this.tabParams);
      this.tabParams=undefined;
    }
  }

  moveToHome(){
    if(this.selectedTab==0){
      window.location.reload();
    }
    this.tabRef.select(0);
  }

  back() {
    this.tabRef.select(5);
  }

  goToShoppingBasket(){
    this.tabRef.select(4);
  }
}
