import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { OrderPage } from '../order/order';
import { StorageProvider } from '../../providers/storage/storage';
import { ShoppingbasketProvider } from '../../providers/shoppingbasket/shoppingbasket';
import { TabsPage } from '../tabs/tabs';
import { ServerProvider } from '../../providers/server/server';

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

  isMember:boolean;
  totalNumber:number;
  //checkedProducts = Array();
  //checkedAllProducts:boolean;
  itemNumber:number;
  checkedItemNumber:number;
  deliveryFee:number;
  shoppingBasket = { orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, checkedAllProducts: true, checkedProducts: [], orderedProducts: [] };

  //orderInfo = {orderPrice:0, sale:0, deliveryFee:0, totalPrice:0, shoppingBasket:[]};

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App, private alertCtrl:AlertController , 
    public storageProvider: StorageProvider, public shoppingbasketProvider:ShoppingbasketProvider, public serverProvider:ServerProvider) {

    this.isMember = this.storageProvider.isMember;
    this.shoppingBasket = this.shoppingbasketProvider.shoppingBasket;
    this.itemNumber = this.shoppingBasket.orderedProducts.length;

    for(let i=0; i<this.itemNumber; i++){
      this.shoppingBasket.checkedProducts[i] = true;
      if (this.shoppingBasket.orderedProducts[i]['count'] == undefined || this.shoppingBasket.orderedProducts[i]['count'] == null){
        this.shoppingBasket.orderedProducts[i]['count'] = 1;
      }
    }

    this.checkedItemNumber = 0;
    
    this.deliveryFee = storageProvider.deliveryFee;

    this.calOrderPrice();
  }

  ionViewWillEnter() {
    if(this.storageProvider.isMember==true){
      this.serverProvider.loadShoppingbasket().then((res: any) => {
        this.shoppingBasket = res;
        this.itemNumber = this.shoppingBasket.orderedProducts.length;
        console.log(res);
      }, (err) => {
        console.log(err);

      });
    }else{
      this.shoppingBasket = this.shoppingbasketProvider.shoppingBasket;
      this.itemNumber = this.shoppingBasket.orderedProducts.length;
    }

    console.log('ionViewDidLoad ShoppingbasketPage');
  }

  goToHome(){
    this.navCtrl.parent.select(0);
  }

  goToOrder(){
    if (this.checkedItemNumber>0){

      this.shoppingbasketProvider.substituteBasket(this.shoppingBasket);

      if (this.isMember == true) {
        this.app.getRootNavs()[0].push(OrderPage, { class: "shoppingbasket" });
      } else {
        this.app.getRootNavs()[0].push(TabsPage, { class: "shoppingbasket", tabIndex: 3 });
      }
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
    let itemNumber = this.shoppingBasket.checkedProducts.length;

    for (let i = 0; i < itemNumber; i++){
      if (this.shoppingBasket.checkedProducts[i]==true){
                
        orderPrice += this.shoppingBasket.orderedProducts[i].price * this.shoppingBasket.orderedProducts[i].count;
        sale += this.shoppingBasket.orderedProducts[i].sale * this.shoppingBasket.orderedProducts[i].count;
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
    if(this.isMember == true){
      let delProducts = [];
      let orderedProducts = this.shoppingBasket.orderedProducts;

      for(let i=0; i<orderedProducts.length; i++){
        if(this.shoppingBasket.checkedProducts[i] == true){
          delProducts.push(orderedProducts[i]);
        }
      }

      this.serverProvider.delShoppingbasket(delProducts).then((res:any)=>{
        this.serverProvider.loadShoppingbasket().then((res: any) => {
          this.shoppingBasket = res;
          this.itemNumber = this.shoppingBasket.orderedProducts.length;
          console.log(res);
        }, (err) => {
          console.log(err);

        });
      }, (err)=>{
        console.log("err");
      });
    }else{
      this.itemNumber = this.shoppingbasketProvider.delShoppingBasket();
    }
    this.calOrderPrice();
  }
}
