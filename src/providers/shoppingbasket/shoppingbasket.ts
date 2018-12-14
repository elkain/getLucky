import { Injectable } from '@angular/core';

/*
  Generated class for the ShoppingbasketProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShoppingbasketProvider {

  shoppingBasket = { orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, checkedAllProducts: true, checkedProducts: [], orderedProducts:[] };

  constructor() {
    console.log('Hello ShoppingbasketProvider Provider');
  }

  delShoppingBasket(item){

  }

  completeShopping(){

  }

  calProductPrice(product) {
    let salePrice: number;

    if (product.saleMethod == "fixed") {
      salePrice = (product.price - product.discount);
    } else if (product.saleMethod == "percent") {
      salePrice = (product.price * ((100 - product.discount) / 100));
    } else if (product.saleMethod == "none") {
      salePrice = product.price;
    } else {
      console.log("error calProductTotalPrice saleMethod dismatched", product.saleMethod);
      salePrice = 0;
    }

    product.salePrice = salePrice;
    product.totalPrice = (product.price - product.salePrice);
    return salePrice;
  }

  addShoppingBasket(item) {
    let flag = false;

    for (let i = 0; i < this.shoppingBasket.orderedProducts.length; i++) {
      if (item.name == this.shoppingBasket.orderedProducts[i].name) {
        flag = true;
      }
    }

    if (flag == false) {
      this.shoppingBasket.orderedProducts.push(item);
    }
  }

  substituteBasket(shoppingBasket){
    this.shoppingBasket = shoppingBasket;
  }
}
