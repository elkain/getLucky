import { Component, ViewChild } from '@angular/core';
import { Tabs, NavController } from 'ionic-angular';
import { CategoryPage } from '../category/category';
import { SearchPage } from '../search/search';
import { MypagePage } from '../mypage/mypage';
import { HomePage } from '../home/home';
import { ShoppingbasketPage } from '../shoppingbasket/shoppingbasket';
import { ProductdetailPage } from '../productdetail/productdetail';

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
  tab6Root = ProductdetailPage;
  
  shopTitle:string = "MARKET LUCKY";

  @ViewChild('myTabs') tabRef: Tabs;

  selectedTab;
  showHeader;

  constructor(public navCtrl: NavController) {
    
  }

  public onTabsChange() {
    this.selectedTab = this.tabRef.getSelected().index;
    
    if (this.selectedTab == 2 || this.selectedTab == 4){
      this.showHeader = false;
    }else{
      this.showHeader = true;
    }
  }

  moveToHome(){
    if(this.selectedTab==0){
      window.location.reload();
    }
    this.tabRef.select(0);
  }

  goToShoppingBasket(){
    this.tabRef.select(4);
  }
}
