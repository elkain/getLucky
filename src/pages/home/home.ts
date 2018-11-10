import { Component, ViewChild} from '@angular/core';
import { NavController, Slides} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  menu;
  imageURL:string = "./assets/slides/";

  images: string[] = [this.imageURL + "slide1.png", this.imageURL+"slide2.png", this.imageURL+"slide3.png"];

  @ViewChild(Slides) slides: Slides;
  
  constructor(public navCtrl: NavController) {

  }

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }
}
