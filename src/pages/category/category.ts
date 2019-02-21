import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

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

  productAllCategories;
  categoryFont = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');

    this.productAllCategories = [
      { category: "야채", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "정육·계란", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "과일·견과", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "쌀·잡곡", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "유제품", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "과자·빵", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "면류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "햄·어묵·맛살", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "커피·차·음료", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "통조림", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "장류·소스·조미료", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "즉석식품", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "냉동간식", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "식용유·참기름", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "김·해조류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "김치·젓갈·장아찌", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "건어물", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "화장지·위생용품", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "헤어·바디용품", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "구강·면도용품", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "세탁·청소·욕실", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "주방·일회용품", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "유아동", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] }
      //{ category: "잡화류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] }
    ];

    for (let i = 0; i < this.productAllCategories.length; i++){
      this.productAllCategories[i].selected = false;
      /*if(this.productAllCategories[i].category.length > 5){
        this.categoryFont[i] = '1.4rem';
      }else{
        this.categoryFont[i] = '1.8rem';
      }*/
      this.categoryFont[i] = '1.8rem';
    }
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
    this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 0, class: "category", homeSegmentCategory: 1, category: category, subCategory: subCategory});
  }
}
