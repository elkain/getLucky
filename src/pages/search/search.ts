import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ServerProvider } from '../../providers/server/server';
import { SearchProvider } from '../../providers/search/search';

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
  recentSearchItems = new Array();
  seacrhTabSelected;
  popularSearchItems;
  searchTabs = ['최근검색어', '인기검색어'];
  products;

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App, private searchProvider:SearchProvider, public serverProvider:ServerProvider) {
    this.seacrhTabSelected = this.searchTabs[0];
    this.popularSearchItems = this.searchProvider.popularSearchItems;
    this.recentSearchItems = this.searchProvider.recentSearchItems;
  }

  ionViewDidLoad() {
    this.seacrhTabSelected = this.searchTabs[0];
    this.popularSearchItems = this.searchProvider.popularSearchItems;
    this.recentSearchItems = this.searchProvider.recentSearchItems;
    console.log('ionViewDidLoad SearchPage');
  }

  searchTabChange(Category) {
    let idx = this.searchTabs.indexOf(Category);
    this.seacrhTabSelected = this.searchTabs[idx];
  }

  findProducts(){
    
    this.serverProvider.searchItem(this.searchInput).then((res:any)=>{
      if(this.serverProvider.isMember != true){
        let searchInput = { searchWord: this.searchInput, searchID: 0 }
        this.searchProvider.recentSearchItems.push(searchInput);
      }
      this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 0, class: "search", homeSegmentCategory: 1, category: this.searchInput });
    }, (err)=>{
      console.log(err);
      
    });
  }

  undisplayRecentSearchItem(index){
    
    if(this.serverProvider.isMember == true){
      this.serverProvider.undisplayRecentSearchItem(this.recentSearchItems[index].searchID).then((res:any)=>{
        if(res == "success"){
          this.recentSearchItems = this.searchProvider.recentSearchItems;
        }
        console.log(res);
      });
    }else{
      this.recentSearchItems.splice(index, 1);
    }
  }

  selectSearchItem(item){
    this.searchInput = item;
  }
}
