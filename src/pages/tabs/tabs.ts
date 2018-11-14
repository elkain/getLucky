import { Component, ViewChild } from '@angular/core';
import { Tabs } from 'ionic-angular';
import { CategoryPage } from '../category/category';
import { SearchPage } from '../search/search';
import { MypagePage } from '../mypage/mypage';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CategoryPage;
  tab3Root = SearchPage;
  tab4Root = MypagePage;
  
  shopTitle:string = "MARKET LUCKY";

  @ViewChild('myTabs') tabRef: Tabs;

  selectedTab;

  constructor() {
    
  }

  ionViewDidEnter() {
  }

  public onTabsChange() {
    this.selectedTab = this.tabRef.getSelected().index;
  }

  moveToHome(){

  }
}
