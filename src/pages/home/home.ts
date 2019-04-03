import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides, App, PopoverController, NavParams, Platform, Content, AlertController } from 'ionic-angular';
import { Storage} from '@ionic/storage';
import { ProductdetailPage } from '../productdetail/productdetail';
import { ShoppingbasketPopoverPage } from '../shoppingbasket-popover/shoppingbasket-popover';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';
import { ServerProvider } from '../../providers/server/server';
import { SearchProvider } from '../../providers/search/search';
import { MemberProvider } from '../../providers/member/member';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  shopTitle = "MARKET LUCKY";
  
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;
  imageURL:string = "./assets/slides/";
  productImageURL:string = "./assets/imgs/"

  refreshorEnable:boolean;
  infiniteScrollEnable: boolean;

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
  contentHeight = "100%";
  headerHeight = "98px";
  contentMargin = "0";
  offset = 0;
  scrollAmount=0;

  username: string;
  password: string;

  slideImages: string[] = [this.imageURL + "slide1.jpg", this.imageURL + "slide2.jpg", this.imageURL + "slide3.jpg"];

  constructor(public navCtrl: NavController, private app: App, public popoverCtrl: PopoverController, public navParams: NavParams, public zone: NgZone,
    public shoppingbasketProvider: ShoppingbasketProvider, public serverProvider:ServerProvider, private platform:Platform, public searchProvider:SearchProvider,
    public memberProvider: MemberProvider ,private storage:Storage, public alertCtrl:AlertController) {
    this.homeParams = navParams.data;
    this.offset = 0;
    if(this.serverProvider.dataLoad == false){
      this.serverProvider.init().then((res: any) => {
        if (res == "success") {
          this.serverProvider.dataLoad = true;
          this.showProducts = this.serverProvider.homeProducts;
          
          if (this.showProducts != undefined || this.showProducts.length != undefined) {
            this.infiniteScrollSetting(this.showProducts.length);
          }else{
            this.infiniteScrollEnable = false;
          }
        }
        console.log(res);
      }, (err) => {
        console.log(err);
      });

      this.storage.get('autoLoginCheckbox').then((autoLoginCheck)=>{
        console.log(autoLoginCheck);
        if(autoLoginCheck == true){
          this.storage.get('username').then((val)=>{
            this.username = val;

            this.storage.get('password').then((val) => {
              this.password = val;
              this.serverProvider.login(this.username, this.password).then((res: any) => {
                console.log(res);

                if (res == "success") {
                  this.serverProvider.isMember = true;

                  for (let i in this.memberProvider.memberData) {
                    for (let j in this.memberProvider.memberData) {
                      if (i == j) {
                        this.memberProvider.memberData[i] = this.memberProvider.memberData[j];
                      }
                    }
                  }
                }
              });
            }, (err) => {
              this.storage.set('autoLoginCheckbox', false);
              let alert = this.alertCtrl.create({
                message: '자동로그인 실패',
                buttons: [{
                  text: '확인',
                }],
                cssClass: 'alert-modify-member'
              });
              alert.present();
            });
          })
        }else{
          this.storage.get('shoppingbasket').then((val)=>{
            if(val!=null){
              this.shoppingbasketProvider.shoppingBasket = val;
            }
          });
        }
      });
    }
    
    this.refreshorEnable = true;
    this.offset = 0;
  }

  scrollHandler() {
    //console.log(`ScrollEvent: ${event}`)
    this.zone.run(() => {
      // since scrollAmount is data-binded,
      // the update needs to happen in zone
      this.content.scrollToTop(0);
    })
  }

  ionViewDidEnter() {
    if (this.homeParams.class == "category"){
      this.contentHeight = "calc(100% - 38px)";
      this.headerHeight = "98px";
      this.contentMargin = "38px";
      this.showProducts = this.serverProvider.categoryProducts;
    } else if (this.homeParams.class == "search"){
      this.headerHeight = "98px";
      this.showProducts = this.serverProvider.searchProducts;
    }else{
      this.contentHeight = "100%";
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
    
    if (this.showProducts != undefined || this.showProducts.length != undefined) {
      this.infiniteScrollSetting(this.showProducts.length);
    } else {
      this.infiniteScrollEnable = false;
    }

    this.offset = 0;
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
    this.scrollHandler();
    let idx = this.homeCategories.indexOf(Category);
    this.showProducts = this.serverProvider.homeProducts;
    this.homeCategorySelected = this.homeCategories[idx];
    this.bestCategorySelected = this.bestCategories[0];
    this.saleCategorySelected = this.saleCategories[0];
    this.productSortOptionSelected = this.productSortOptions[0];

    if(this.homeCategorySelected != this.homeCategories[0]){
      this.headerHeight = "98px";
      this.contentMargin = "38px";
      this.productsSort("판매인기순", this.showProducts);
    }else{
      this.contentMargin = "0px";
      this.headerHeight = "98px";
      this.showProducts = this.serverProvider.homeProducts;
    }

    if (this.homeCategorySelected == this.homeCategories[3] || this.homeCategorySelected == this.homeCategories[0] ){
      this.showProductPage=false;
      this.contentMargin = "0px";
      this.headerHeight = "98px";
      //this.contentHeight = "calc(100% - 48px)";
      this.contentHeight = "100%";
    }else{
      this.showProductPage = true;
      this.contentHeight = "calc(100% - 38px)";
    }

    this.showProducts = this.sortProductsByCategory(this.serverProvider.homeProducts, this.bestCategorySelected);

    if (this.homeCategorySelected == this.homeCategories[3]) {
      this.infiniteScrollEnable = false;
      this.refreshorEnable = false;
    } else if (this.showProducts != undefined || this.showProducts.length != undefined) {
      this.infiniteScrollSetting(this.showProducts.length);
      this.refreshorEnable = true;
    } else{
      this.infiniteScrollEnable = false;
      this.refreshorEnable = true;
    }
    
    this.offset = 0;
  }

  bestCategoryChange(Category) {
    this.scrollHandler();
    let idx = this.bestCategories.indexOf(Category);
    this.bestCategorySelected = this.bestCategories[idx];
    this.showProducts = this.sortProductsByCategory(this.serverProvider.homeProducts, this.bestCategorySelected);
    this.productsSort(this.productSortOptionSelected, this.showProducts);

    if (this.showProducts != undefined || this.showProducts.length != undefined) {
      this.infiniteScrollSetting(this.showProducts.length);
    } else {
      this.infiniteScrollEnable = false;
    }
  }

  saleCategoryChange(Category) {
    this.scrollHandler();
    let idx = this.saleCategories.indexOf(Category);
    this.saleCategorySelected = this.saleCategories[idx];
    this.showProducts = this.sortProductsByCategory(this.serverProvider.homeProducts, this.saleCategorySelected);
    this.productsSort(this.productSortOptionSelected, this.showProducts);

    if (this.showProducts != undefined || this.showProducts.length != undefined) {
      this.infiniteScrollSetting(this.showProducts.length);
    } else {
      this.infiniteScrollEnable = false;
    }
  }

  categoryChange(Category) {
    this.scrollHandler();
    let idx = this.homeParams.category.subCategories.indexOf(Category);
    this.categorySelected = this.homeParams.category.subCategories[idx];
    this.showProducts = this.sortProductsByCategory(this.serverProvider.categoryProducts, this.categorySelected);
    this.productsSort(this.productSortOptionSelected, this.showProducts);

    if (this.showProducts != undefined || this.showProducts.length != undefined) {
      this.infiniteScrollSetting(this.showProducts.length);
    } else {
      this.infiniteScrollEnable = false;
    }
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
        this.storage.set("shoppingbasket", this.shoppingbasketProvider.shoppingBasket);
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
    } else {
      this.showProductPage = true;
    }

    if(this.homeParams.class == "category"){
      this.contentHeight = "calc(100% - 38px)";
      this.headerHeight = "98px";
      this.contentMargin = "38px";
      this.showProducts = this.sortProductsByCategory(this.serverProvider.categoryProducts, this.categorySelected);
    } else if (this.homeParams.class == "search"){
      this.showProducts = this.serverProvider.searchProducts;
    }else{
      this.showProducts = this.serverProvider.homeProducts;
      this.contentHeight = "100%";
    }

    if (this.showProducts != undefined || this.showProducts.length != undefined) {
      this.infiniteScrollSetting(this.showProducts.length);
    } else {
      this.infiniteScrollEnable = false;
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
    this.offset = 0;
    console.log('Begin async operation');
    if (this.homeParams.class == "category"){
      this.serverProvider.getCategoryProductData(this.homeParams.category).then((res:any)=>{
        if(res == "success"){
          this.showProducts = this.serverProvider.categoryProducts;
          this.categoryChange(this.categorySelected);
          this.productsSort(this.productSortOptionSelected, this.showProducts);
          event.complete();
        }else{
          event.cancel();
        }
      }, (error)=>{
        console.log(error);
        
        event.cancel();
      });
    } else if (this.homeParams.class == "search"){
      let searchItems = this.searchProvider.recentSearchItems;
      let searchWord = searchItems[searchItems.length - 1];
      this.serverProvider.searchItem(searchWord.searchWord).then((res: any) => {
        if(res=="success"){
          event.complete();
        }else{
          event.cancel();
        }
        
      }, (err) => {
        console.log(err);
        event.cancel();
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
        }else{
          event.cancel();
        }
        console.log(res);
      }, (err) => {
        console.log(err);
        event.cancel();
      });
    }
  }

  doPulling(refresher) {
    console.log('DOPULLING', refresher.progress);
    if (refresher.progress<0.2){
      refresher.cancel();
    }
  }

  loadData(event) {
    this.offset += 20;
    console.log('Begin async operation');
    if (this.homeParams.class == "category") {
      this.serverProvider.getCategoryProductData(this.homeParams.category, this.offset).then((res: any) => {
        console.log(this.homeParams.category);
        
        if (res == "success") {
          this.showProducts = this.serverProvider.categoryProducts;
          this.categoryChange(this.categorySelected);
          this.productsSort(this.productSortOptionSelected, this.showProducts);
        }
        event.complete();
      }, (err) => {
        console.log(err);
        event.complete();
      });
    } else if (this.homeParams.class == "search") {
      let searchItems = this.searchProvider.recentSearchItems;
      let searchWord = searchItems[searchItems.length - 1];
      this.serverProvider.searchItem(searchWord.searchWord, this.offset).then((res: any) => {
        event.complete();
      }, (err) => {
        console.log(err);
        event.complete();
      });
    } else {
      this.serverProvider.getAllProductData(this.offset).then((res: any) => {
        if (res.status == "success") {
          this.showProducts = this.serverProvider.homeProducts;
          this.homeCategoryChange(this.homeCategorySelected);
          if (this.homeCategorySelected == "베스트") {
            console.log(this.bestCategorySelected);
            this.sortProductsByCategory(this.showProducts, this.bestCategorySelected);
            this.productsSort(this.productSortOptionSelected, this.showProducts);
          } else if (this.homeCategorySelected == "알뜰할인") {
            this.sortProductsByCategory(this.showProducts, this.saleCategorySelected);
            this.productsSort(this.productSortOptionSelected, this.showProducts);
          }
        }
        event.complete();
        console.log(res);
      }, (err) => {
        console.log(err);
        event.complete();
      });
    }
  }

  infiniteScrollSetting(length){
    if(length>=20){
      this.infiniteScrollEnable = true;
    }else{
      this.infiniteScrollEnable = false;
    }
  }
}
