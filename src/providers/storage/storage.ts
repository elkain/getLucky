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
  shopTitle: string = "MARKET LUCKY";
  deliveryFee = 3000;
  deliveryFreeString = "3만원";
  deliveryFreeFee = 30000;
  recentSearchItems = new Array();
  popularSearchItems ;
  product;
  memberData: { username: string, password: string, name: string, email: string, mobile: string, address: string, birth: string, sex: string };
  findMemberData : {username: string, name:string, email:string, mobile:string, type:string, method:string};

  constructor() {
    console.log('Hello StorageProvider Provider');
    this.isMember = false;
    this.popularSearchItems = ["가", "나", "다"];
    this.memberData = { username: "", password: "", name: "", email: "", mobile: "", address: "", birth: "", sex: "" };
    this.findMemberData= { username: "", name: "", email: "", mobile: "", type: "", method: "" };
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
