import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { OrderPage } from '../order/order';
import { StorageProvider } from '../../providers/storage/storage';

/**
 * Generated class for the ShoppingbasketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shoppingbasket',
  templateUrl: 'shoppingbasket.html',
})
export class ShoppingbasketPage {

  product = { name: "", price: 0, saleMethod: "", discount: 0, count: 1, salePrice: 0, totalPrice: 0 };
  deliveryFee;
  deliveryFreeString;
  checkedProduct;
  checkedAllProduct;

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App, public storageProvider:StorageProvider) {
    this.product.name = "상품명";
    this.product.price = 5000;
    this.product.saleMethod = "fixed";
    this.product.discount = 1000;
    this.product.count = 1;
    this.product.salePrice = this.storageProvider.calProductSalePrice(this.product);
    this.product.totalPrice = this.product.salePrice * this.product.count;
    this.deliveryFee = storageProvider.deliveryFee;
    this.deliveryFreeString = storageProvider.deliveryFreeString;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingbasketPage');
  }

  goToHome(){
    this.navCtrl.parent.select(0);
  }

  goToOrder(){
    this.app.getRootNavs()[0].push(OrderPage, {class:"OrderPage"});
  }

  increaseProductNum() {
    this.product.count++;
    this.product.totalPrice = this.product.salePrice * this.product.count;
  }

  decreaseProductNum() {

    if (this.product.count > 1) {
      this.product.count--;
    }

    this.product.totalPrice = this.product.salePrice * this.product.count;
  }

  updateProductCheck(){
    console.log(this.checkedProduct);
    if(this.checkedProduct==false){
      this.checkedAllProduct = false;
    }
  }

  updateAllProductCheck(){
    console.log(this.checkedAllProduct);

    if(this.checkedAllProduct==true){
      this.checkedProduct = true;
    }
    else{
      this.checkedProduct = false;
    }
  }
}
