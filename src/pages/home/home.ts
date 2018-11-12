import { Component, ViewChild} from '@angular/core';
import { NavController, Slides} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;
  imageURL:string = "./assets/slides/";

  categories = ["럭키추천", "베스트", "알뜰할인",  "이벤트"];
  categorySelected;

  items: string[] = [this.imageURL + "slide1.png", this.imageURL + "slide2.png", this.imageURL + "slide3.png"];
  images: string[] = [this.imageURL + "slide1.jpg", this.imageURL+"slide2.jpg", this.imageURL+"slide3.jpg"];

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    this.categorySelected = this.categories[0];
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

  categoryChange(Category) {
    console.log(this.categorySelected);
    let idx = this.categories.indexOf(Category);
    this.categorySelected = this.categories[idx];
  }
}
