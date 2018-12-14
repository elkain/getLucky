import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { OrderPage } from '../order/order';
import { StorageProvider } from '../../providers/storage/storage';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';

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

  totalNumber:number;
  checkedProduct = Array();
  checkedAllProduct:boolean;
  itemNumber:number;
  checkedItemNumber:number;
  deliveryFee:number;
  shoppingBasket = [];
  shoppingBasket1 = { orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, checkedAllProduct: true, checkedProduct: [], orderedProducts: [] };

  orderInfo = {orderPrice:0, sale:0, deliveryFee:0, totalPrice:0, shoppingBasket:[]};

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App, private alertCtrl:AlertController , 
    public storageProvider: StorageProvider, public shoppingbasketProvider:ShoppingbasketProvider) {

    this.shoppingBasket1 = this.shoppingbasketProvider.shoppingBasket;

    console.log("this.shoppingBasket1.orderedProducts.length : " + this.shoppingBasket1.orderedProducts.length);
    
    this.shoppingBasket = this.storageProvider.shoppingBasket;
    
    this.itemNumber = this.shoppingBasket.length;
    this.itemNumber = this.shoppingBasket1.orderedProducts.length;
    this.checkedItemNumber = 0;

    for (let i = 0; i < this.shoppingBasket1.orderedProducts.length; i++){
      this.shoppingBasket1.checkedProduct.push(true);
    }
    this.shoppingBasket1.checkedAllProduct = true;

    for (let i = 0; i < this.itemNumber; i++) {
      this.checkedProduct.push(true);
    }
    this.checkedAllProduct = true;

    this.deliveryFee = storageProvider.deliveryFee;
    this.calOrderPrice();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingbasketPage');
  }

  goToHome(){
    this.navCtrl.parent.select(0);
  }

  goToOrder(){
    if (this.checkedItemNumber>0){
      this.orderInfo.shoppingBasket = [];

      for(let i = 0; i<this.shoppingBasket.length; i++){
        if(this.checkedProduct[i]==true){
          this.orderInfo.shoppingBasket.push(this.shoppingBasket[i]);
        }
      }

      this.app.getRootNavs()[0].push(OrderPage, { class: "OrderPage", orderInfo: this.orderInfo});
    }else{
      let alert = this.alertCtrl.create({
        message: '선택된 상품이 없습니다..',
        buttons: [{
          text: '확인',
        }],
        cssClass: 'alert-modify-member'
      });
      alert.present();
    }
  }

  increaseProductNum(index) {
    this.orderInfo.shoppingBasket[index].count++;
    this.orderInfo.shoppingBasket[index].totalPrice = this.orderInfo.shoppingBasket[index].salePrice * this.orderInfo.shoppingBasket[index].count;

    this.calOrderPrice();
  }

  decreaseProductNum(index) {

    if (this.orderInfo.shoppingBasket[index].count > 1) {
      this.orderInfo.shoppingBasket[index].count--;
    }

    this.orderInfo.shoppingBasket[index].totalPrice = this.orderInfo.shoppingBasket[index].salePrice * this.orderInfo.shoppingBasket[index].count;

    this.calOrderPrice();
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
    
    this.calOrderPrice();
  }

  calOrderPrice(){
    let orderPrice = 0;
    let sale = 0;
    let checkedItemNumber = 0;

    for(let i = 0; i<this.checkedProduct.length; i++){
      if(this.checkedProduct[i]==true){
        orderPrice += this.shoppingBasket[i].price * this.shoppingBasket[i].count;
        
        if (this.shoppingBasket[i].saleMethod=='fixed'){
          sale += this.shoppingBasket[i].discount * this.shoppingBasket[i].count;
        }else{
          sale += this.shoppingBasket[i].price * this.shoppingBasket[i].discount / 100 * this.shoppingBasket[i].count;
        }

        checkedItemNumber++;
      }
    }

    this.orderInfo.orderPrice = orderPrice;
    this.orderInfo.sale = sale;
    this.checkedItemNumber = checkedItemNumber;

    if ((orderPrice - sale) >= this.storageProvider.deliveryFreeFee) {
      this.orderInfo.deliveryFee = 0;
    } else if (this.orderInfo.orderPrice == 0){
      this.orderInfo.deliveryFee = 0;
    }else{
      this.orderInfo.deliveryFee = this.storageProvider.deliveryFee;
    }

    this.orderInfo.totalPrice = this.orderInfo.orderPrice - this.orderInfo.sale + this.orderInfo.deliveryFee
  }

  deleteItem(){
    for (let i = this.checkedProduct.length - 1; i >=0; i--) {
      if (this.checkedProduct[i] == true) {
        this.orderInfo.shoppingBasket.splice(i,1);
        this.checkedProduct.splice(i,1);
      }
    }

    this.calOrderPrice();
  }
}
