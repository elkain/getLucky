import { Injectable } from '@angular/core';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {

  orderInfos = [];
  count:number = 100000;

  constructor() {
    console.log('Hello OrderProvider Provider');
  }

  addOrderInfo(order){

    this.count++;
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
    this.orderInfos.push(order);
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
