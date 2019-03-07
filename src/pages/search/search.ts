import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { StorageProvider } from '../../providers/storage/storage';
import { ServerProvider } from '../../providers/server/server';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App, public storageProvider:StorageProvider, public serverProvider:ServerProvider) {
    this.seacrhTabSelected = this.searchTabs[0];
    this.popularSearchItems = this.storageProvider.popularSearchItems;
    this.recentSearchItems = this.storageProvider.recentSearchItems;
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad SearchPage');
  }

  searchTabChange(Category) {
    let idx = this.searchTabs.indexOf(Category);
    this.seacrhTabSelected = this.searchTabs[idx];
  }

  findProducts(){
    this.storageProvider.recentSearchItems.push(this.searchInput);
    this.serverProvider.searchItem(this.searchInput).then((res:any)=>{
      if(res == "noItem"){
        this.storageProvider.products = [];
        this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 0, class: "search", homeSegmentCategory: 1, category: this.searchInput });
      }else{
        this.storageProvider.products = res;
        this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 0, class: "search", homeSegmentCategory: 1, category: this.searchInput });
      }
    }, (err)=>{
      console.log(err);
      
    });
  }

  deleteRecentSearchItem(index){
    console.dir(index);
    
    this.recentSearchItems.splice(index,1);
    this.storageProvider.recentSearchItems = this.recentSearchItems;
  }

  selectSearchItem(item){
    this.searchInput = item;
  }
}
