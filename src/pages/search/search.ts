import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchInput: string = '';
  recentSearchItems :string[];
  seacrhTabSelected;
  popularSearchItems: string[];
  searchTabs = ['최근검색어', '인기검색어'];

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App) {
    this.seacrhTabSelected = this.searchTabs[0];
    this.recentSearchItems = ["A", "B", "C"];
    this.popularSearchItems = ["가", "나", "다"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  searchTabChange(Category) {
    let idx = this.searchTabs.indexOf(Category);
    this.seacrhTabSelected = this.searchTabs[idx];
  }

  findProducts(){
    this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 0, class: "search", homeSegmentCategory: 1, category: this.searchInput});
  }
}
