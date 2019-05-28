import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides, App, PopoverController, NavParams, Platform, Content, AlertController } from 'ionic-angular';
import { Storage} from '@ionic/storage';
import { ProductdetailPage } from '../productdetail/productdetail';
import { ShoppingbasketPopoverPage } from '../shoppingbasket-popover/shoppingbasket-popover';
import { NoticePopoverPage } from '../notice-popover/notice-popover';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';
import { ServerProvider } from '../../providers/server/server';
import { SearchProvider } from '../../providers/search/search';
import { MemberProvider } from '../../providers/member/member';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  shopTitle = "MARKET LUCKY";
  
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;
  imageURL:string = "./assets/slides/";
  productImageURL:string = "./assets/imgs/";

  refreshorEnable:boolean;
  infiniteScrollEnable: boolean;

  homeCategories = [
    { displayName: "럭키추천", displayCode: 2 },
    { displayName: "베스트", displayCode: 3 },
    { displayName: "알뜰할인", displayCode: 4 },
    { displayName: "이벤트", displayCode: 5 }
  ];
  homeSubcategories;
  homeCategorySelected;

  homeSubCategorySelected;
  saleCategorySelected;
  categorySelected = {subCategoryCode:0, subCategoryName:""};

  productSortOptions = ["판매인기순","높은가격순", "낮은가격순"];
  productSortOptionSelected;

  events = [this.imageURL + "slide1.png", this.imageURL + "slide2.png", this.imageURL + "slide3.png"];
  homeParams;
  products = [];
  serverProducts = [];
  showProducts=[];

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
      this.storage.remove('auth');
      this.serverProvider.init().then((res: any) => {
        if (res == "success") {
          this.serverProvider.dataLoad = true;
          this.showProducts = this.serverProvider.homeProducts;
          this.homeCategories = this.serverProvider.homeCategories;
          this.homeSubcategories = this.serverProvider.homeSubcategories;
          this.homeCategorySelected = this.homeCategories[0];
        }
        console.log(res);
      }, (err) => {
        console.log(err);
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
    this.homeCategories = this.serverProvider.homeCategories;
    if (this.homeParams.class == "category"){
      this.contentHeight = "calc(100% - 38px)";
      this.headerHeight = "98px";
      this.contentMargin = "38px";
      this.showProducts = this.serverProvider.categoryProducts;
      this.infiniteScrollSetting('category');
    } else if (this.homeParams.class == "search"){
      this.headerHeight = "98px";
      this.showProducts = this.serverProvider.searchProducts;
      this.infiniteScrollSetting('search');
    }else{
      this.contentHeight = "100%";
      this.showProducts = this.serverProvider.homeProducts;
      this.homeCategories = this.serverProvider.homeCategories;
      this.homeSubcategories = this.serverProvider.homeSubcategories;
      this.infiniteScrollEnable = false;
    }

    this.homeCategorySelected = this.homeCategories[0];
    
    this.productSortOptionSelected = this.productSortOptions[0];
    this.headerHeight = "98px";
    this.contentMargin = "0";
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
    this.refreshToken();
    this.app.getRootNavs()[0].push(ProductdetailPage, {class:"home", product:item});
  }

  slideItemSelect(){
    
  }

  homeCategoryChange(Category) {
    this.refreshToken();
    this.scrollHandler();
    let idx = this.homeCategories.indexOf(Category);
    this.showProducts = this.serverProvider.homeProducts;
    this.homeCategorySelected = this.homeCategories[idx];
    this.homeSubCategorySelected = '전체';
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

    if (this.homeCategorySelected == this.homeCategories[3]) {
      this.refreshorEnable = false;
    }else{
      this.refreshorEnable = true;
    }
    
    this.offset = 0;
  }

  homeSubCategoryChange(Category) {
    this.refreshToken();
    this.scrollHandler();
    if (Category == '전체') {
      this.homeSubCategorySelected = "전체";
    } else {
      let idx = this.homeSubcategories.indexOf(Category);
      this.homeSubCategorySelected = this.homeSubcategories[idx];
      this.productsSort(this.productSortOptionSelected, this.showProducts);

      if (this.showProducts != undefined || this.showProducts.length != undefined) {
        this.infiniteScrollSetting(this.showProducts.length);
      } else {
        this.infiniteScrollEnable = false;
      }
    }
  }

  /*saleCategoryChange(Category) {
    this.scrollHandler();
    let idx = this.saleCategories.indexOf(Category);
    this.saleCategorySelected = this.saleCategories[idx];
    this.productsSort(this.productSortOptionSelected, this.showProducts);

    if (this.showProducts != undefined || this.showProducts.length != undefined) {
      this.infiniteScrollSetting(this.showProducts.length);
    } else {
      this.infiniteScrollEnable = false;
    }
  }*/

  categoryChange(Category) {
    this.refreshToken();
    this.scrollHandler();
    let idx = this.homeParams.category.subCategories.indexOf(Category);
    this.categorySelected = this.homeParams.category.subCategories[idx];
    this.productsSort(this.productSortOptionSelected, this.showProducts);

    let showProductsCnt = this.categoryProductCnt('category');

    if(showProductsCnt < 20){
      this.infiniteScrollEnable = false;
    }else{
      this.infiniteScrollEnable = true;
    }
  }

  /*sortProductsByCategory(products, category){
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
  }*/
  
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
        this.serverProvider.addShoppingbasket(product).then((res) => {
          console.log('add shopping basket ' + res);

        }, (err) => {
          console.log(err);

          if (err == 'expired') {
            let alert = this.alertCtrl.create({
              message: '세션이 만료되었습니다.',
              buttons: [{
                text: '확인',
                handler: () => {
                  this.homeCategoryChange(this.homeCategories[0]);
                }
              }],
              cssClass: 'alert-modify-member'
            });
            alert.present();
          }
        });
      }else{
        this.shoppingbasketProvider.addShoppingBasket(product);
        this.storage.set("shoppingbasket", this.shoppingbasketProvider.shoppingBasket);
      }
    }
    
    const popover = this.popoverCtrl.create(ShoppingbasketPopoverPage, {class:"home"}, { cssClass: 'popover-shopping-basket'});
    popover.present();
  }

  categoryProductCnt(type){
    let cnt = 0;

    if(type == 'home'){
      for (let i = 0; i < this.showProducts.length; i++) {
        if (this.homeSubCategorySelected.displayCode == this.showProducts[i].displayCode || this.homeSubCategorySelected == '전체') {
          cnt++;
        }
      }
    }else if(type=='category'){
      for (let i = 0; i < this.showProducts.length; i++) {
        if (this.categorySelected.subCategoryCode == this.showProducts[i].categoryCode || this.categorySelected.subCategoryName == '전체') {
          cnt++;
        }
      }
    }else if(type=='search'){
      return this.showProducts.length;
    }

    return cnt;
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
      this.homeSubcategories = this.serverProvider.homeSubcategories;
    }

    this.homeSubCategorySelected = '전체';
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
      this.showProducts = this.serverProvider.categoryProducts;
      this.infiniteScrollSetting('category');
    } else if (this.homeParams.class == "search"){
      this.showProducts = this.serverProvider.searchProducts;
      this.infiniteScrollSetting('search');
    }else{
      this.homeCategories = this.serverProvider.homeCategories;
      this.showProducts = this.serverProvider.homeProducts;
      this.contentHeight = "100%";
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
    else if (this.homeCategorySelected == this.homeCategories[1] || this.homeCategorySelected == this.homeCategories[2]){
      let idx = this.homeSubcategories.indexOf(this.homeSubCategorySelected);

      if (event.direction == 4) { // DIRECTION_RIGHT =4 
        while (idx >= 1 && this.homeSubcategories[idx - 1].displayCategoryCode != this.homeCategorySelected.displayCategoryCode) {
          idx--;
        }
        if (idx >= 1) {
          this.homeSubCategoryChange(this.homeSubcategories[idx - 1]);
        } else if (this.homeSubCategorySelected == '전체'){
          if (this.homeCategorySelected == this.homeCategories[1]) {
            this.homeCategoryChange(this.homeCategories[0]);
          } else if (this.homeCategorySelected == this.homeCategories[2]) {
            this.homeCategoryChange(this.homeCategories[1]);
          }
        }else {
          this.homeSubCategoryChange('전체');
        }
      } else if (event.direction == 2) { // DRIECTION_LEFT = 2
        while (idx < this.homeSubcategories.length - 1 && this.homeSubcategories[idx + 1].displayCategoryCode != this.homeCategorySelected.displayCategoryCode) {
          idx++;
        }
        if (idx < this.homeSubcategories.length - 1) {
          this.homeSubCategoryChange(this.homeSubcategories[idx + 1]);
        } else {
          if (this.homeCategorySelected == this.homeCategories[1]){
            this.homeCategoryChange(this.homeCategories[2]);
          } else if (this.homeCategorySelected == this.homeCategories[2]){
            this.homeCategoryChange(this.homeCategories[3]);
          }
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
      this.serverProvider.refreshHomeProductsData().then((res:any)=>{
        if(res=="success"){
          this.showProducts = this.serverProvider.homeProducts;
          this.productsSort(this.productSortOptionSelected, this.showProducts);
          event.complete();
        }else{
          event.cancel();
        }
      }, (err)=>{
        console.log(err);
        event.cancel();
      });
    }
  }

  doPulling(refresher) {
    console.log('DOPULLING', refresher.progress);
    if (refresher.progress<0.18){
      refresher.cancel();
    }
  }

  loadData(event) {
    
    console.log('Begin async operation');
    if (this.homeParams.class == "category" && this.categorySelected.subCategoryName != '전체') {
      this.offset = this.categoryProductCnt('category');
      this.serverProvider.getMoreCategoryProductData(this.categorySelected.subCategoryCode, this.offset).then((res: any) => {
        console.log(this.homeParams.category);
        
        if (res == "success") {
          this.showProducts = this.serverProvider.categoryProducts;
          this.productsSort(this.productSortOptionSelected, this.showProducts);
        }else if(res == "loadEnd"){
          this.showProducts = this.serverProvider.categoryProducts;
          this.productsSort(this.productSortOptionSelected, this.showProducts);
          this.infiniteScrollEnable = false;
        }else{
          this.infiniteScrollEnable = false;
        }
        event.complete();
      }, (err) => {
        this.infiniteScrollEnable = false;
        console.log(err);
        event.complete();
      });
    } else if (this.homeParams.class == "search") {
      this.offset = this.categoryProductCnt('search');
      let searchItems = this.searchProvider.recentSearchItems;
      let searchWord = searchItems[searchItems.length - 1];
      this.serverProvider.searchItem(searchWord.searchWord, this.offset).then((res: any) => {
        if(res == "success"){
          this.showProducts = this.serverProvider.searchProducts;
          this.productsSort(this.productSortOptionSelected, this.showProducts);
        }else if(res == "loadEnd"){
          this.showProducts = this.serverProvider.searchProducts;
          this.productsSort(this.productSortOptionSelected, this.showProducts);
          this.infiniteScrollEnable = false;
        }else{
          this.infiniteScrollEnable = false;
        }
        event.complete();
      }, (err) => {
        this.infiniteScrollEnable = false;
        console.log(err);
        event.complete();
      });
    } else {
      this.infiniteScrollEnable = false;
      event.complete();
    }
  }
  
  infiniteScrollSetting(type){
    if(this.categoryProductCnt(type)%20!=0){
      this.infiniteScrollEnable = false;
    }else{
      this.infiniteScrollEnable = true;
    }
  }

  alertNotice(type){
    let popover = this.popoverCtrl.create(NoticePopoverPage, { class: "home", type:type }, { cssClass: 'notice-popover' });
    popover.present();
  }

  refreshToken() {
    this.serverProvider.validateAccessToken().then((res) => {
      if (res == 'success') {
        return true;
      } else {
        return false;
      }
    }, err => {
      console.log(err);

      let alert = this.alertCtrl.create({
        message: '세션이 만료되었습니다.',
        buttons: [{
          text: '확인',
          handler: () => {
            this.navCtrl.setRoot(TabsPage, { class: "home", tabIndex: 0 });
          }
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    });

    return false;
  }
}
