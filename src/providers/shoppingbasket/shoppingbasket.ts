import { Injectable } from '@angular/core';

/*
  Generated class for the ShoppingbasketProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShoppingbasketProvider {

  shoppingBasket = { orderPrice: 0, sale: 0, deliveryFee: 0, totalPrice: 0, checkedAllProduct: true, checkedProduct: [], orderedProducts:[] };

  constructor() {
    console.log('Hello ShoppingbasketProvider Provider');
  }

  addShoppingBasket(item) {

  }

  delShoppingBasket(item){

  }

  completeShopping(){

  }

  calProductSalePrice(product) {
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

    return salePrice;
  }

}
