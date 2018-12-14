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
  //checkedProducts = Array();
  //checkedAllProducts:boolean;
  itemNumber:number;
  checkedItemNumber:number;
  deliveryFee:number;
  shoppingBasket = { orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, checkedAllProducts: true, checkedProducts: [], orderedProducts: [] };

  //orderInfo = {orderPrice:0, sale:0, deliveryFee:0, totalPrice:0, shoppingBasket:[]};

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App, private alertCtrl:AlertController , 
    public storageProvider: StorageProvider, public shoppingbasketProvider:ShoppingbasketProvider) {

    this.shoppingBasket = this.shoppingbasketProvider.shoppingBasket;
    this.itemNumber = this.shoppingBasket.orderedProducts.length;
    this.checkedItemNumber = 0;

    for (let i = 0; i < this.shoppingBasket.orderedProducts.length; i++){
      this.shoppingBasket.checkedProducts.push(true);
      this.shoppingBasket.orderedProducts[i].count = 1;
    }
    this.shoppingBasket.checkedAllProducts = true;
    this.deliveryFee = storageProvider.deliveryFee;

    console.log(this.shoppingBasket.orderedProducts[0].count);
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
      /*this.shoppingBasket.orderedProducts = [];

      for (let i = 0; i < this.itemNumber; i++){
        if(this.checkedProducts[i]==true){
          this.shoppingBasket.orderedProducts.push(this.shoppingBasket.orderedProducts[i]);
        }
      }*/

      this.app.getRootNavs()[0].push(OrderPage, { class: "OrderPage"});
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
    this.shoppingBasket.orderedProducts[index].count++;
    this.shoppingBasket.orderedProducts[index].totalPrice = this.shoppingBasket.orderedProducts[index].salePrice * this.shoppingBasket.orderedProducts[index].count;

    this.calOrderPrice();
  }

  decreaseProductNum(index) {

    if (this.shoppingBasket.orderedProducts[index].count > 1) {
      this.shoppingBasket.orderedProducts[index].count--;
    }

    this.shoppingBasket.orderedProducts[index].totalPrice = this.shoppingBasket.orderedProducts[index].salePrice * this.shoppingBasket.orderedProducts[index].count;

    this.calOrderPrice();
  }

  updateProductCheck(index){

    if (this.shoppingBasket.checkedProducts[index] == false){
      this.shoppingBasket.checkedAllProducts = false;
    }

    this.calOrderPrice();
  }

  updateAllProductCheck(){

    for (let i = 0; i < this.itemNumber; i++){
      this.shoppingBasket.checkedProducts[i] = this.shoppingBasket.checkedAllProducts;
    }
    
    this.calOrderPrice();
  }

  calOrderPrice(){
    let orderPrice = 0;
    let sale = 0;
    let checkedItemNumber = 0;

    for (let i = 0; i < this.shoppingBasket.checkedProducts.length; i++){
      if (this.shoppingBasket.checkedProducts[i]==true){
        orderPrice += this.shoppingBasket.orderedProducts[i].price * this.shoppingBasket.orderedProducts[i].count;
        
        if (this.shoppingBasket.orderedProducts[i].saleMethod=='fixed'){
          sale += this.shoppingBasket.orderedProducts[i].discount * this.shoppingBasket.orderedProducts[i].count;
        }else{
          sale += this.shoppingBasket.orderedProducts[i].price * this.shoppingBasket.orderedProducts[i].discount / 100 * this.shoppingBasket.orderedProducts[i].count;
        }

        checkedItemNumber++;
      }
    }

    this.shoppingBasket.orderPrice = orderPrice;
    this.shoppingBasket.sale = sale;
    this.checkedItemNumber = checkedItemNumber;

    if ((orderPrice - sale) >= this.storageProvider.deliveryFreeFee) {
      this.shoppingBasket.deliveryFee = 0;
    } else if (this.shoppingBasket.orderPrice == 0){
      this.shoppingBasket.deliveryFee = 0;
    }else{
      this.shoppingBasket.deliveryFee = this.storageProvider.deliveryFee;
    }

    this.shoppingBasket.totalPrice = this.shoppingBasket.orderPrice - this.shoppingBasket.sale + this.shoppingBasket.deliveryFee
  }

  deleteItem(){
    for (let i = this.itemNumber - 1; i >=0; i--) {
      if (this.shoppingBasket.checkedProducts[i] == true) {
        this.shoppingBasket.orderedProducts.splice(i,1);
        this.shoppingBasket.checkedProducts.splice(i,1);

        this.itemNumber--;
      }
    }

    this.calOrderPrice();
  }
}
