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

  productSortOptions = ["판매인기순","높은가격순", "낮은가격순"];
  productSortOptionSelected;

  events = [this.imageURL + "slide1.png", this.imageURL + "slide2.png", this.imageURL + "slide3.png"];

  products;

  images: string[] = [this.imageURL + "slide1.jpg", this.imageURL + "slide2.jpg", this.imageURL + "slide3.jpg"];

  constructor(public navCtrl: NavController) {

    this.products = [   // sale method : fixed, percent
      { name: "사과", price: 3000, discount: 2000, saleMethod: "fixed", saleCount: 2, imagePath: this.imageURL + "slide1.png" },
      { name: "배", price: 10000, discount: 10, saleMethod: "percent", saleCount: 4, imagePath: this.imageURL + "slide2.png" },
      { name: "감", price: 5000, discount: 1500, saleMethod: "fixed", saleCount: 6, imagePath: this.imageURL + "slide3.png" },
      { name: "야채", price: 2500, discount: 5, saleMethod: "percent", saleCount: 8, imagePath: this.imageURL + "slide1.png" },
      { name: "빼빼로", price: 4000, discount: 1000, saleMethod: "fixed", saleCount: 1, imagePath: this.imageURL + "slide2.png" },
      { name: "초콜릿", price: 7000, discount: 8, saleMethod: "fixed", saleCount: 0, imagePath: this.imageURL + "slide3.png" },
      { name: "요구르트", price: 500, discount: 0, saleMethod: "none", saleCount: 12, imagePath: this.imageURL + "slide1.png" },
    ]; 

    /* 할인율을 적용하여 가격 측정 */
    for (var i=0; i < this.products.length; i++) {
      if (this.products[i].saleMethod == "fixed") {
        this.products[i].salePrice = this.products[i].price - this.products[i].discount;
      } else if (this.products[i].saleMethod == "percent") {
        this.products[i].salePrice = this.products[i].price * (100 - this.products[i].discount);
      } else {
        this.products[i].salePrice = this.products[i].price;
      }
    }
  }

  ionViewDidEnter() {
    this.homeCategorySelected = this.homeCategories[0];
    this.bestCategorySelected = this.bestCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];
    console.log("[HomePage] ionViewDidEnter");
  }
  
  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  itemSelected(item){
    this.navCtrl.parent.select(5);
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
