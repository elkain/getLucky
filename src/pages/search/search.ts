import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ServerProvider } from '../../providers/server/server'; 
import { SearchProvider } from '../../providers/search/search';
import { Storage } from '@ionic/storage';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App, private searchProvider:SearchProvider, public serverProvider:ServerProvider,
    public storage:Storage, public alertCtrl:AlertController) {
    this.seacrhTabSelected = this.searchTabs[0];
    this.popularSearchItems = this.searchProvider.popularSearchItems;

    if(this.serverProvider.isMember==true){
      this.recentSearchItems = this.searchProvider.recentSearchItems;
    }else{
      this.storage.get("recentSearchItems").then((val) => {
        if (val != null) {
          this.recentSearchItems = val;
        }
      });
    }
    
  }

  ionViewDidEnter() {
    this.seacrhTabSelected = this.searchTabs[0];
    this.popularSearchItems = this.searchProvider.popularSearchItems;

    if (this.serverProvider.isMember == true) {
      this.recentSearchItems = this.searchProvider.recentSearchItems;
    } else {
      this.storage.get("recentSearchItems").then((val) => {
        if (val != null) {
          this.recentSearchItems = val;
        }
      });
    }
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
        this.recentSearchItems = this.searchProvider.recentSearchItems;
        this.storage.set("recentSearchItems", this.recentSearchItems);
      }
      this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 0, class: "search", homeSegmentCategory: 1, category: this.searchInput });
    }, (err)=>{
      console.log(err);

      if(err == 'expired'){
        let alert = this.alertCtrl.create({
          message: '세션이 만료되었습니다.',
          buttons: [{
            text: '확인',
            handler: () => {
              this.navCtrl.parent.select(0);
            }
          }],
          cssClass: 'alert-modify-member'
        });
        alert.present();
      }
    });
  }

  undisplayRecentSearchItem(index){
    
    if(this.serverProvider.isMember == true){
      this.serverProvider.undisplayRecentSearchItem(this.recentSearchItems[index].searchID).then((res:any)=>{
        if(res == "success"){
          this.recentSearchItems = this.searchProvider.recentSearchItems;
        }
        console.log(res);
      }, (err)=>{
        console.log(err);
        
        if (err == 'expired') {
          let alert = this.alertCtrl.create({
            message: '세션이 만료되었습니다.',
            buttons: [{
              text: '확인',
              handler: () => {
                this.navCtrl.parent.select(0);
              }
            }],
            cssClass: 'alert-modify-member'
          });
          alert.present();
        }
      });
    }else{
      this.recentSearchItems.splice(index, 1);
      this.storage.set("recentSearchItems", this.recentSearchItems);
    }
  }

  selectSearchItem(item){
    this.searchInput = item;
  }
}
