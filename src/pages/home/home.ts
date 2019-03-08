import { Component, ViewChild} from '@angular/core';
import { NavController, Slides, App, PopoverController, NavParams, Platform, Refresher} from 'ionic-angular';
import { ProductdetailPage } from '../productdetail/productdetail';
import { ShoppingbasketPopoverPage } from '../shoppingbasket-popover/shoppingbasket-popover';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';
import { ServerProvider } from '../../providers/server/server';
import { SearchProvider } from '../../providers/search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  shopTitle = "MARKET LUCKY";
  
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
  serverProducts = [];
  showProducts;

  showProductPage:boolean;
  bestScrollHeight = "calc(100% - 88px)";
  headerHeight = "98px";
  contentMargin = "0";

  slideImages: string[] = [this.imageURL + "slide1.jpg", this.imageURL + "slide2.jpg", this.imageURL + "slide3.jpg"];

  constructor(public navCtrl: NavController, private app: App, public popoverCtrl: PopoverController, public navParams:NavParams,
    public shoppingbasketProvider: ShoppingbasketProvider, public serverProvider:ServerProvider, private platform:Platform, public searchProvider:SearchProvider) {
    this.homeParams = navParams.data;
    
    if(this.serverProvider.dataLoad == false){
      this.serverProvider.init().then((res: any) => {
        if (res == "success") {
          this.serverProvider.dataLoad = true;
          this.showProducts = this.serverProvider.homeProducts;
        }
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    }
    console.log(this.showProducts);
  }

  ionViewDidEnter() {
    if (this.homeParams.class == "category"){
      this.bestScrollHeight = "calc(100% - 38px)";
      this.headerHeight = "98px";
      this.contentMargin = "38px";
      this.showProducts = this.serverProvider.categoryProducts;
    } else if (this.homeParams.class == "search"){
      this.headerHeight = "98px";
      this.showProducts = this.serverProvider.searchProducts;
    }else{
      this.showProducts = this.serverProvider.homeProducts;
    }

    this.homeCategorySelected = this.homeCategories[0];
    this.bestCategories = this.serverProvider.bestCategories;
    this.saleCategories = this.serverProvider.saleCategories;
    
    this.bestCategorySelected = this.bestCategories[0];
    this.saleCategorySelected = this.saleCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];
    this.headerHeight = "98px";
    this.contentMargin = "0";
  }

  ionViewDidLeave(){
    if (this.homeParams.class == "category" || this.homeParams.class == "search"){
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
    this.showProducts = this.serverProvider.homeProducts;
    this.homeCategorySelected = this.homeCategories[idx];
    this.bestCategorySelected = this.bestCategories[0];
    this.saleCategorySelected = this.saleCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];

    if(this.homeCategorySelected != this.homeCategories[0]){
      this.headerHeight = "136px";
      this.contentMargin = "38px";
      this.productsSort("판매인기순", this.showProducts);
    }else{
      this.contentMargin = "0px";
      this.headerHeight = "98px";
      this.showProducts = this.serverProvider.homeProducts;
    }

    if (this.homeCategorySelected == this.homeCategories[3] ){
      this.showProductPage=false;
      this.contentMargin = "0px";
      this.headerHeight = "98px";
      //this.bestScrollHeight = "calc(100% - 48px)";
      this.bestScrollHeight = "100%";
    }else{
      this.showProductPage = true;
      this.bestScrollHeight = "calc(100% - 38px)";
    }

    this.showProducts = this.sortProductsByCategory(this.serverProvider.homeProducts, this.bestCategorySelected);
  }

  bestCategoryChange(Category) {
    let idx = this.bestCategories.indexOf(Category);
    this.bestCategorySelected = this.bestCategories[idx];
    this.showProducts = this.sortProductsByCategory(this.serverProvider.homeProducts, this.bestCategorySelected);
    this.productsSort(this.productSortOptionSelected, this.showProducts);
  }

  saleCategoryChange(Category) {
    let idx = this.saleCategories.indexOf(Category);
    this.saleCategorySelected = this.saleCategories[idx];
    this.showProducts = this.sortProductsByCategory(this.serverProvider.homeProducts, this.saleCategorySelected);
    this.productsSort(this.productSortOptionSelected, this.showProducts);
  }

  categoryChange(Category) {
    let idx = this.homeParams.category.subCategories.indexOf(Category);
    this.categorySelected = this.homeParams.category.subCategories[idx];
    this.showProducts = this.sortProductsByCategory(this.serverProvider.categoryProducts, this.categorySelected);
    this.productsSort(this.productSortOptionSelected, this.showProducts);
  }

  sortProductsByCategory(products, category){
    let showProducts = [];
    
    if(category.subCategoryName == "전체"){
      return products;
    }

    if (this.homeParams.class == "category"){
      for (let i = 0; i < products.length; i++) {
        if (products[i].categoryCode == category.subCategoryCode) {
          showProducts.push(products[i]);
        }
      }  
    }else{
      for (let i = 0; i < products.length; i++) {
        if (products[i].classCategoryCode == category.subCategoryCode) {
          showProducts.push(products[i]);
        }
      }  
    }
    
    return showProducts;
  }
  
  productsOptionChange(){
    if(this.showProducts.length >1){
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
      if (this.serverProvider.isMember == true) {
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
      this.headerHeight = "98px";
      this.contentMargin = "0";
    }

    this.bestCategorySelected = this.bestCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];

    if (this.homeParams.class == "search") {
      this.showProductPage = false;
      this.bestScrollHeight = "calc(100%)";
    } else {
      this.showProductPage = true;
      this.bestScrollHeight = "calc(100% - 88px)";
    }

    if(this.homeParams.class == "category"){
      this.bestScrollHeight = "calc(100% - 38px)";
      this.headerHeight = "98px";
      this.contentMargin = "38px";
      this.showProducts = this.sortProductsByCategory(this.serverProvider.categoryProducts, this.categorySelected);
    } else if (this.homeParams.class == "search"){
      this.showProducts = this.serverProvider.searchProducts;
    }else{
      this.showProducts = this.serverProvider.homeProducts;
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

  doRefresh(event) {
    console.log('Begin async operation');
    if (this.homeParams.class == "category"){
      this.serverProvider.getCategoryProductData(this.homeParams.category).then((res:any)=>{
        if(res == "success"){
          this.showProducts = this.serverProvider.categoryProducts;
          this.categoryChange(this.categorySelected);
          this.productsSort(this.productSortOptionSelected, this.showProducts);
        }
        event.complete();
      });
    } else if (this.homeParams.class == "search"){
      let searchItems = this.searchProvider.recentSearchItems;
      let searchWord = searchItems[searchItems.length - 1];
      this.serverProvider.searchItem(searchWord.searchWord).then((res: any) => {
        event.complete();
      }, (err) => {
        console.log(err);

      });
    } else{
      this.serverProvider.init().then((res: any) => {
        if (res == "success") {
          this.showProducts = this.serverProvider.homeProducts;
          this.homeCategoryChange(this.homeCategorySelected);
          if(this.homeCategorySelected == "베스트"){
            console.log(this.bestCategorySelected);
            this.sortProductsByCategory(this.showProducts, this.bestCategorySelected);
            this.productsSort(this.productSortOptionSelected, this.showProducts);
          }else if(this.homeCategorySelected == "알뜰할인"){
            this.sortProductsByCategory(this.showProducts, this.saleCategorySelected);
            this.productsSort(this.productSortOptionSelected, this.showProducts);
          }
          
          event.complete();
        }
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    }
  }
}
