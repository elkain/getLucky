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
  productImageURL:string = "./assets/imgs/"

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
  showProducts;

  showProductPage:boolean;
  bestScrollHeight = "calc(100% - 88px)";

  slideImages: string[] = [this.imageURL + "slide1.jpg", this.imageURL + "slide2.jpg", this.imageURL + "slide3.jpg"];

  constructor(public navCtrl: NavController, private app: App, public popoverCtrl: PopoverController, public navParams:NavParams,
    public storageProvider: StorageProvider, public shoppingbasketProvider: ShoppingbasketProvider) {

    this.homeParams = navParams.data;     // category from category page
   
    this.products = this.storageProvider.products;

    /* 할인율을 적용하여 가격 측정 */
    for (var i = 0; i < this.products.length; i++) {
      this.storageProvider.calProductPrice(this.products[i]);
    }
  }

  ionViewDidEnter() {
    this.bestCategories = this.storageProvider.bestCategories;
    this.saleCategories = this.storageProvider.saleCategories;
    
    this.homeCategorySelected = this.homeCategories[0];
    this.bestCategorySelected = this.bestCategories[0];
    this.saleCategorySelected = this.saleCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];
    this.productsSort("판매인기순");
  }
  
  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  itemSelected(item){
    this.app.getRootNavs()[0].push(ProductdetailPage, {class:"home", product:item});
  }

  slideItemSelect(){
    
  }

  homeCategoryChange(Category) {
    let idx = this.homeCategories.indexOf(Category);
    this.homeCategorySelected = this.homeCategories[idx];
    this.bestCategorySelected = this.bestCategories[0];
    this.saleCategorySelected = this.saleCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];

    if (this.homeCategorySelected == this.homeCategories[3] ){
      this.showProductPage=false;
      this.bestScrollHeight = "calc(100% - 48px)";
    }else{
      this.showProductPage = true;
      this.bestScrollHeight = "calc(100% - 88px)";
    }

    this.showProducts = this.sortProductsByCategory(this.products, this.bestCategorySelected);
  }

  bestCategoryChange(Category) {
    let idx = this.bestCategories.indexOf(Category);
    this.bestCategorySelected = this.bestCategories[idx];

    this.showProducts = this.sortProductsByCategory(this.products, this.bestCategorySelected);
  }

  saleCategoryChange(Category) {
    let idx = this.saleCategories.indexOf(Category);
    this.saleCategorySelected = this.saleCategories[idx];
  }

  categoryChange(Category) {
    let idx = this.homeParams.category.subCategories.indexOf(Category);
    this.bestCategorySelected = this.homeParams.category.subCategories[idx];
  }

  sortProductsByCategory(products, category){
    let showProducts = [];
    
    if(category == "전체"){
      return products;
    }

    console.log(products);
    for (let i = 0; i < this.products.length; i++) {
      if (products[i].category == category) {
        
        
        showProducts.push(products[i]);
      }
    }
    return showProducts;
  }
  
  productsOptionChange(){
    if(this.products.length >1){
      this.productsSort(this.productSortOptionSelected);
    }
  }

  // 정렬 함수
  //productSortOptions = ["판매인기순", "높은가격순", "낮은가격순"];
  productsSort(option){
    
    if(option == "판매인기순"){
      this.products.sort((a,b) => {
        return a.saleCount > b.saleCount ? -1 : a.saleCount > b.saleCount ? 1 : 0;
      });
    } else if (option == "높은가격순"){
      this.products.sort((a, b) => {
        return a.salePrice > b.salePrice ? -1 : a.salePrice > b.salePrice ? 1 : 0;
      });
    } else if (option == "낮은가격순"){
      this.products.sort((a, b) => {
        return a.salePrice < b.salePrice ? -1 : a.salePrice < b.salePrice ? 1 : 0;
      });
    }else{
      return this.products;
    }
  }

  addToShoppingBasket(product) {

    this.shoppingbasketProvider.addShoppingBasket(product);
    const popover = this.popoverCtrl.create(ShoppingbasketPopoverPage, {class:"home"}, { cssClass: 'popover-shopping-basket'});
    popover.present();
  }

  ionSelected() {
  
    if (this.homeParams.homeSegmentCategory == 1) {
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
  
  homeSwipeCategory(event){
    let idx = this.homeCategories.indexOf(this.homeCategorySelected);

    if (event.direction == 4) { // DIRECTION_RIGHT =4 
      if (idx >= 1) {
        this.homeCategoryChange(this.homeCategories[idx - 1])
      }
    } else if (event.direction == 2) { // DRIECTION_LEFT = 2
      if (idx < this.homeCategories.length - 1) {
        this.homeCategoryChange(this.homeCategories[idx + 1]);
      }
    }
  }

  swipeSubcategory(event){
    if(this.homeCategorySelected == this.homeCategories[1]){
      let idx = this.bestCategories.indexOf(this.bestCategorySelected);

      if (event.direction == 4) { // DIRECTION_RIGHT =4 
        if (idx >= 1) {
          this.bestCategoryChange(this.bestCategories[idx - 1]);
        } else {
          this.homeCategoryChange(this.homeCategories[0]);
        }
      } else if (event.direction == 2) { // DRIECTION_LEFT = 2
        if (idx < this.bestCategories.length - 1) {
          this.bestCategoryChange(this.bestCategories[idx + 1]);
        } else {
          this.homeCategoryChange(this.homeCategories[2]);
        }
      }
    }else if (this.homeCategorySelected == this.homeCategories[2]) {
      let idx = this.saleCategories.indexOf(this.saleCategorySelected);

      if (event.direction == 4) { // DIRECTION_RIGHT =4 
        if (idx >= 1) {
          this.saleCategoryChange(this.saleCategories[idx - 1]);
        } else {
          this.homeCategoryChange(this.homeCategories[1]);
        }
      } else if (event.direction == 2) { // DRIECTION_LEFT = 2
        if (idx < this.saleCategories.length - 1) {
          this.saleCategoryChange(this.saleCategories[idx + 1]);
        } else {
          this.homeCategoryChange(this.homeCategories[3]);
        }
      }
    }
  }
}
