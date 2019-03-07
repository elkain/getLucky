import { Injectable } from '@angular/core';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {

  orderInfos = [];
  orderInfo;
  orderedProduct;
  count:number = 100000;
  deliveryFee = 3000;
  deliveryFreeString = "3만원";
  deliveryFreeFee = 30000;

  constructor() {
    console.log('Hello OrderProvider Provider');
    this.orderedProduct = {};
  }

  addOrderInfo(order){

/*    this.count++;
    order.status = "배송준비중";

    var d = new Date();
    var yy = d.getFullYear();
    var mm = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    var dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    var hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    var min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    var sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
    var dString = yy + '-' + (mm) + '-' + dd + ' ' + hh + ":" + min + ":" + sec;

    order.id = yy.toString(10) + mm + dd + this.count.toString(10);
    
    order.regTime = dString;
    order.count = order.orderedProducts.length;*/

    // 장바구니 삭제 시 주문관련 데이터가 사라지지 않도록 직접적으로 주문정보를 복사
    this.orderInfo = JSON.parse(JSON.stringify(order));
    this.orderInfos.push(this.orderInfo);
  }
}
