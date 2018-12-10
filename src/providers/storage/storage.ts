//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  isMember:boolean;
  deliveryFee = 3000;
  deliveryFreeString = "3만원";
  deliveryFreeFee = 30000;
  recentSearchItems = new Array();
  popularSearchItems ;

  constructor() {
    console.log('Hello StorageProvider Provider');
    this.isMember = false;
    this.popularSearchItems = ["가", "나", "다"];
  }
}
