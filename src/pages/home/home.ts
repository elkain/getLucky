import { Component, ViewChild} from '@angular/core';
import { NavController, Slides, App, PopoverController, NavParams} from 'ionic-angular';
import { ProductdetailPage } from '../productdetail/productdetail';
import { ShoppingbasketPopoverPage } from '../shoppingbasket-popover/shoppingbasket-popover';
import { StorageProvider } from '../../providers/storage/storage';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';
import { ServerProvider } from '../../providers/server/server';

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
  products = [];
  showProducts;

  showProductPage:boolean;
  bestScrollHeight = "calc(100% - 88px)";

  slideImages: string[] = [this.imageURL + "slide1.jpg", this.imageURL + "slide2.jpg", this.imageURL + "slide3.jpg"];

  constructor(public navCtrl: NavController, private app: App, public popoverCtrl: PopoverController, public navParams:NavParams,
    public storageProvider: StorageProvider, public shoppingbasketProvider: ShoppingbasketProvider, public serverProvider:ServerProvider) {
    this.homeParams = navParams.data;
  }

  ionViewDidEnter() {

    if(this.homeParams.class == "category"){
      this.products = JSON.parse(JSON.stringify(this.storageProvider.products));
    }else{
      this.serverProvider.getAllProductData().then((res: any) => {
        this.storageProvider.products = res;
        this.products = JSON.parse(JSON.stringify(this.storageProvider.products));
        //console.log(res);
      }, (err) => {
        console.log(err);
      });
    }

    this.homeCategorySelected = this.homeCategories[0];
    this.bestCategories = this.storageProvider.bestCategories;
    this.saleCategories = this.storageProvider.saleCategories;
    
    this.bestCategorySelected = this.bestCategories[0];
    this.saleCategorySelected = this.saleCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];
  }

  ionViewDidLeave(){
    if(this.homeParams.class == "category"){
      this.homeParams.class = undefined;
    }
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
    this.products = JSON.parse(JSON.stringify(this.storageProvider.products));
    this.homeCategorySelected = this.homeCategories[idx];
    this.bestCategorySelected = this.bestCategories[0];
    this.saleCategorySelected = this.saleCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];

    if(this.homeCategorySelected != this.homeCategories[0]){
      this.productsSort("판매인기순", this.products);
    }else{
      this.serverProvider.getAllProductData().then((res: any) => {
        this.storageProvider.products = res;
        this.products = JSON.parse(JSON.stringify(this.storageProvider.products));
        //console.log(res);
      }, (err) => {
        console.log(err);
      });
    }

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
    this.productsSort(this.productSortOptionSelected, this.showProducts);
  }

  saleCategoryChange(Category) {
    let idx = this.saleCategories.indexOf(Category);
    this.saleCategorySelected = this.saleCategories[idx];
    this.showProducts = this.sortProductsByCategory(this.products, this.saleCategorySelected);
    this.productsSort(this.productSortOptionSelected, this.showProducts);
  }

  categoryChange(Category) {
    let idx = this.homeParams.category.subCategories.indexOf(Category);
    this.categorySelected = this.homeParams.category.subCategories[idx];
    this.showProducts = this.sortProductsByCategory(this.products, this.categorySelected);
    this.productsSort(this.productSortOptionSelected, this.showProducts);
  }

  sortProductsByCategory(products, category){
    let showProducts = [];
    
    if(category.subCategoryName == "전체"){
      return products;
    }

    if(this.homeParams.class == "category"){
      for (let i = 0; i < this.products.length; i++) {
        if (products[i].categoryCode == category.subCategoryCode) {
          showProducts.push(products[i]);
        }
      }  
    }else{
      for (let i = 0; i < this.products.length; i++) {
        if (products[i].classCategoryCode == category.subCategoryCode) {
          showProducts.push(products[i]);
        }
      }  
    }
    
    return showProducts;
  }
  
  productsOptionChange(){
    if(this.products.length >1){
      this.productsSort(this.productSortOptionSelected, this.showProducts);
    }
  }

  // 정렬 함수
  //productSortOptions = ["판매인기순", "높은가격순", "낮은가격순"];
  productsSort(option, products){
    if(option == "판매인기순"){
      products.sort((a,b) => {
        return a.soldStock > b.soldStock ? -1 : a.soldStock > b.soldStock ? 1 : 0;
      });
    } else if (option == "높은가격순"){
      products.sort((a, b) => {
        return a.salePrice > b.salePrice ? -1 : a.salePrice > b.salePrice ? 1 : 0;
      });
    } else if (option == "낮은가격순"){
      products.sort((a, b) => {
        return a.salePrice < b.salePrice ? -1 : a.salePrice < b.salePrice ? 1 : 0;
      });
    }else{
      return products;
    }
  }

  addToShoppingBasket(product) {
    let flag = this.shoppingbasketProvider.isProductInShoppingbasket(product);

    if (flag != true){
      if (this.storageProvider.isMember == true) {
        this.serverProvider.addShoppingbasket(product);
      }else{
        this.shoppingbasketProvider.addShoppingBasket(product);
      }
    }
    
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

    if(this.homeParams.class == "category"){
      this.showProducts = this.sortProductsByCategory(this.products, this.categorySelected);
    } else if (this.homeParams.class == "search"){
      
    }else{
      this.serverProvider.getAllProductData().then((res: any) => {
        this.storageProvider.products = res;
        this.products = JSON.parse(JSON.stringify(this.storageProvider.products));
        //console.log(res);
      }, (err) => {
        console.log(err);
      });
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
    if (this.homeParams.class == "category"){

      let categories = this.homeParams.category.subCategories;
      let idx = categories.indexOf(this.categorySelected);

      if (event.direction == 4) { // DIRECTION_RIGHT =4 
        if (idx >= 1) {
          this.categoryChange(categories[idx - 1]);
        } 
      } else if (event.direction == 2) { // DRIECTION_LEFT = 2
        if (idx < categories.length - 1) {
          this.categoryChange(categories[idx + 1]);
        } 
      }
    }
    else if(this.homeCategorySelected == this.homeCategories[1]){
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

  /*onopen() {
    var url = "http://www.ftc.go.kr/bizCommPop.do?wrkr_no=2128174157";
    window.open(url, "bizCommPop", "width=750, height=700;");
  }*/
}
