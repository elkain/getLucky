import { Injectable } from '@angular/core';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {

  orderInfos = [];

  constructor() {
    console.log('Hello OrderProvider Provider');
  }

  addOrderInfo(order){
    this.orderInfos.push(order);
  }
}
