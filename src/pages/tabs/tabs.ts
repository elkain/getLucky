import { Component } from '@angular/core';

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

  shopTitle:string = "MARKET LUCKY"
  constructor() {

  }

  moveToHome(){

  }
}
