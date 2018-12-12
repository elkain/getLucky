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

  shoppingBasket = Array();
  orderPrice;
  sale;
  deliveryFee;
  totalPrice;
  totalNumber;
  deliveryFreeString;
  checkedProduct = Array();
  checkedAllProduct;
  itemNumber:number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App, public storageProvider:StorageProvider) {
    this.shoppingBasket = this.storageProvider.shoppingBasket;
    this.itemNumber = this.shoppingBasket.length;

    for(let i = 0; i<this.itemNumber; i++){
      this.checkedProduct.push(false);
    }

    this.deliveryFee = storageProvider.deliveryFee;
    this.deliveryFreeString = storageProvider.deliveryFreeString;
    
    /*this.product.name = "상품명";
    this.product.price = 5000;
    this.product.saleMethod = "fixed";
    this.product.discount = 1000;
    this.product.count = 1;
    this.product.salePrice = this.storageProvider.calProductSalePrice(this.product);
    this.product.totalPrice = this.product.salePrice * this.product.count;
    */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingbasketPage');
  }

  goToHome(){
    this.navCtrl.parent.select(0);
  }

  goToOrder(){
    this.app.getRootNavs()[0].push(OrderPage, {class:"OrderPage", shoppingBasket:this.shoppingBasket});
  }

  increaseProductNum(index) {
    this.shoppingBasket[index].count++;
    this.shoppingBasket[index].totalPrice = this.shoppingBasket[index].salePrice * this.shoppingBasket[index].count;

    this.calOrderPrice()
  }

  decreaseProductNum(index) {

    if (this.shoppingBasket[index].count > 1) {
      this.shoppingBasket[index].count--;
    }

    this.shoppingBasket[index].totalPrice = this.shoppingBasket[index].salePrice * this.shoppingBasket[index].count;

    this.calOrderPrice()
  }

  updateProductCheck(index){

    if(this.checkedProduct[index] == false){
      this.checkedAllProduct = false;
    }

    this.calOrderPrice();
  }

  updateAllProductCheck(){

    for(let i = 0; i<this.checkedProduct.length; i++){
      this.checkedProduct[i] = this.checkedAllProduct;
    }
    
    this.calOrderPrice()
  }

  calOrderPrice(){
    let orderPrice;
    let sale;

    for(let i = 0; i<this.checkedProduct.length; i++){
      if(this.checkedProduct[i]==true){
        orderPrice += this.shoppingBasket[i].price;

        if(this.shoppingBasket[i].saleMethod=='fixed'){
          sale += this.shoppingBasket[i].discount;
        }else{
          sale += this.shoppingBasket[i].price * this.shoppingBasket[i].discount/100;
        }
      }
    }

    this.orderPrice = orderPrice;
    this.sale = sale;

    if ((orderPrice - sale) > this.storageProvider.deliveryFreeFee) {
      this.deliveryFee = 0;
    } else {
      this.deliveryFee = this.storageProvider.deliveryFee;
    }
  }
}
