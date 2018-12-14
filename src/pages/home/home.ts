import { Component, ViewChild} from '@angular/core';
import { NavController, Slides, App, PopoverController, NavParams} from 'ionic-angular';
import { ProductdetailPage } from '../productdetail/productdetail';
import { ShoppingbasketPopoverPage } from '../shoppingbasket-popover/shoppingbasket-popover';
import { StorageProvider } from '../../providers/storage/storage';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;
  imageURL:string = "./assets/slides/";

  homeCategories = ["럭키추천", "베스트", "알뜰할인",  "이벤트"];
  homeCategorySelected;

  bestCategories;
  bestCategorySelected;

  saleCategories;
  saleCategorySelected;

  categorySelected;

  productSortOptions = ["판매인기순","높은가격순", "낮은가격순"];
  productSortOptionSelected;

  events = [this.imageURL + "slide1.png", this.imageURL + "slide2.png", this.imageURL + "slide3.png"];
  homeParams;
  products;

  showProductPage:boolean;
  bestScrollHeight = "calc(100% - 88px)";

  images: string[] = [this.imageURL + "slide1.jpg", this.imageURL + "slide2.jpg", this.imageURL + "slide3.jpg"];

  constructor(public navCtrl: NavController, private app: App, public popoverCtrl: PopoverController, public navParams:NavParams,
    public storageProvider: StorageProvider, public shoppingbasketProvider: ShoppingbasketProvider) {

    this.homeParams = navParams.data;     // category from category page

    this.products = [   // sale method : fixed, percent
      { name: "사과", price: 3000, discount: 2000, saleMethod: "fixed", saleCount: 2, imagePath: this.imageURL + "slide1.png" },
      { name: "배", price: 10000, discount: 10, saleMethod: "percent", saleCount: 4, imagePath: this.imageURL + "slide2.png" },
      { name: "감", price: 5000, discount: 1500, saleMethod: "fixed", saleCount: 6, imagePath: this.imageURL + "slide3.png" },
      { name: "야채", price: 2500, discount: 5, saleMethod: "percent", saleCount: 8, imagePath: this.imageURL + "slide1.png" },
      { name: "빼빼로", price: 4000, discount: 1000, saleMethod: "fixed", saleCount: 1, imagePath: this.imageURL + "slide2.png" },
      { name: "초콜릿", price: 7000, discount: 8, saleMethod: "percent", saleCount: 0, imagePath: this.imageURL + "slide3.png" },
      { name: "요구르트", price: 500, discount: 0, saleMethod: "none", saleCount: 12, imagePath: this.imageURL + "slide1.png" },
    ]; 

    /* 할인율을 적용하여 가격 측정 */
    for (var i = 0; i < this.products.length; i++) {
      this.storageProvider.calProductPrice(this.products[i]);
    }
    
    /*for (var i=0; i < this.products.length; i++) {
      this.products[i].count = 1;
      
      if (this.products[i].saleMethod == "fixed") {
        this.products[i].salePrice = this.products[i].price - this.products[i].discount;
      } else if (this.products[i].saleMethod == "percent") {
        this.products[i].salePrice = this.products[i].price * (100 - this.products[i].discount)/100;
      } else {
        this.products[i].salePrice = this.products[i].price;

      }
    }*/
  }

  ionViewDidEnter() {
    this.bestCategories = this.storageProvider.bestCategories;
    this.saleCategories = this.storageProvider.saleCategories;
    console.log(this.homeParams.class);
    
    this.homeCategorySelected = this.homeCategories[0];
    this.bestCategorySelected = this.bestCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];
  }
  
  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  itemSelected(item){
    this.app.getRootNavs()[0].push(ProductdetailPage, {class:"ProductdetailPage", product:item});
  }

  slideItemSelect(){
    
  }

  homeCategoryChange(Category) {
    let idx = this.homeCategories.indexOf(Category);
    this.homeCategorySelected = this.homeCategories[idx];

    if (this.homeCategorySelected == this.homeCategories[3] ){
      this.showProductPage=false;
      this.bestScrollHeight = "calc(100% - 48px)";
    }else{
      this.showProductPage = true;
      this.bestScrollHeight = "calc(100% - 88px)";
    }

    console.log(this.showProductPage);
    
  }

  bestCategoryChange(Category) {
    let idx = this.bestCategories.indexOf(Category);
    this.bestCategorySelected = this.bestCategories[idx];
  }

  saleCategoryChange(Category) {
    let idx = this.saleCategories.indexOf(Category);
    this.saleCategorySelected = this.saleCategories[idx];
  }


  categoryChange(Category) {
    let idx = this.homeParams.category.subCategories.indexOf(Category);
    this.bestCategorySelected = this.homeParams.category.subCategories[idx];
  }

  productsOptionChange(){
    
  }

  addToShoppingBasket(product) {

    this.shoppingbasketProvider.addShoppingBasket(product);
    const popover = this.popoverCtrl.create(ShoppingbasketPopoverPage, {product:product}, { cssClass: 'popover-shopping-basket'});
    popover.present();
  }

  ionSelected() {
  
    if (this.homeParams.homeSegmentCategory == 1) {
      console.log(this.homeParams);
      this.homeCategorySelected = this.homeCategories[1];
      this.categorySelected=this.homeParams.subCategory;
      this.homeParams.homeSegmentCategory = undefined;
    } else {
      this.homeCategorySelected = this.homeCategories[0];
      this.homeParams.class = undefined;
    }

    this.bestCategorySelected = this.bestCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];

    if (this.homeParams.class == "search") {
      this.showProductPage = false;
      this.bestScrollHeight = "calc(100% - 48px)";
    } else {
      this.showProductPage = true;
      this.bestScrollHeight = "calc(100% - 88px)";
    }
  }
}
