import { Component, ViewChild} from '@angular/core';
import { NavController, Slides} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  menu = 'recommand';
  imageURL:string = "./assets/slides/";

  items: string[] = [this.imageURL + "slide1.png", this.imageURL + "slide2.png", this.imageURL + "slide3.png"];

  images: string[] = [this.imageURL + "slide1.jpg", this.imageURL+"slide2.jpg", this.imageURL+"slide3.jpg"];

  @ViewChild(Slides) slides: Slides;
  
  constructor(public navCtrl: NavController) {

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
}
