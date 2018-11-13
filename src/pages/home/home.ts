import { Component, ViewChild} from '@angular/core';
import { NavController, Slides} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;
  imageURL:string = "./assets/slides/";

  homeCategories = ["럭키추천", "베스트", "알뜰할인",  "이벤트"];
  homeCategorySelected;

  bestCategories = ["전체", "정육", "청과", "쌀잡곡", "계란", "유제품", "조미료", "과자류", "커피/음료"];
  bestCategorySelected;

  items: string[] = [this.imageURL + "slide1.png", this.imageURL + "slide2.png", this.imageURL + "slide3.png"];
  images: string[] = [this.imageURL + "slide1.jpg", this.imageURL+"slide2.jpg", this.imageURL+"slide3.jpg"];

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    this.homeCategorySelected = this.homeCategories[0];
    this.bestCategorySelected = this.bestCategories[0];
  }

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  itemSelected(item){

  }

  slideItemSelect(){
    
  }

  homeCategoryChange(Category) {
    let idx = this.homeCategories.indexOf(Category);
    this.homeCategorySelected = this.homeCategories[idx];
  }

  bestCategoryChange(Category) {
    let idx = this.bestCategories.indexOf(Category);
    this.bestCategorySelected = this.bestCategories[idx];
  }
}
