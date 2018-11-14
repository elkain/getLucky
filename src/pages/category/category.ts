import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  productCategories =  [
    "정육", "청과", "쌀잡곡", "채소", 
    "계란", "유제품", "냉장냉동", "라면류", 
    "통조림류", "김", "해조류", "조미료", 
    "장류", "생수", "커피/음료", "과자류",
    "시리얼류", "빵류", "휴지", "주방용품",
    "구강용품", "바디용품", "세제류", "잡화류"
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

}
