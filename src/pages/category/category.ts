import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ServerProvider } from '../../providers/server/server';

/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  productAllCategories = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App, public serverProvider:ServerProvider) {
    this.serverProvider.loadCategory().then((res: any) => {
      this.productAllCategories = res;
      for (let i = 0; i < this.productAllCategories.length; i++) {
        this.productAllCategories[i].selected = false;
      }
      console.log("category load");

    }, (err) => {
      console.log(err);

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

  categorySelect(category){
    let idx = this.productAllCategories.indexOf(category);

    if (this.productAllCategories[idx].selected == true){
      this.productAllCategories[idx].selected = false;
    }else{
      for (let i = 0; i < this.productAllCategories.length; i++) {
        this.productAllCategories[i].selected = false;
      }

      this.productAllCategories[idx].selected = true;
    }
  }

  moveToCategory(category, subCategory){
    this.serverProvider.getCategoryProductData(category).then((res: any) => {
      if(res == "success")  {
        this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 0, class: "category", homeSegmentCategory: 1, category: category, subCategory: subCategory });
      }
    });
    
  }
}
