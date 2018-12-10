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

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');

    this.productAllCategories = [
      { category: "정육", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "청과", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "쌀잡곡", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "채소", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "계란", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "유제품", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "냉장냉동", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "라면류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "통조림류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "김", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "해조류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "조미료", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "장류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "생수", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "커피/음료", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "과자류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "시리얼류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "빵류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "휴지", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "주방용품", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "구강용품", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "바디용품", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "세제류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] },
      { category: "잡화류", subCategories: ["전체", "소고기(한우)", "돼지고기", "닭고기"] }
    ];

    for (let i = 0; i < this.productAllCategories.length; i++){
      this.productAllCategories[i].selected = false;
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

  moveToCategory(category){
    this.app.getRootNavs()[0].setRoot(TabsPage, { tabIndex: 0, class: "category", homeSegmentCategory: 1, category:category });
  }
}
