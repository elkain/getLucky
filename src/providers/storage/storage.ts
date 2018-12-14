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
  popularSearchItems= new Array();

  bestCategories = new Array();
  saleCategories = new Array();
  
  memberData: { username: string, password: string, name: string, email: string, mobile: string, address: string, birth: string, sex: string };
  findMemberData: { username: string, name: string, email: string, mobile: string, type: string, method: string };
  deliveryPlaceInfos = [];

  shoppingBasket = Array();
  nonMemberOrderInfo = {};
  memberOrderInfo = {};

  products = new Array();

  mobileOptionLists = ["010", "011", "018"];
  emailOptionLists = ["naver.com", "gmail.com", "daum.net", "outlook.com", "nate.com", "yahoo.com"];
  deliveryTimeLists = ["9:00 ~ 12:00","12::00 ~ 15:00", "15:00 ~ 18:00", "18:00 ~ 21:00"];
  deliveryMemoLists = ["부재시 경비실에 맡겨주세요", "오시기 전에 미리 연락주세요", "빨리 배송해주세요"];

  imageURL: string = "./assets/slides/";

  constructor() {
    console.log('Hello StorageProvider Provider');
    this.isMember = false;
    this.popularSearchItems = ["가", "나", "다"];
    this.memberData = { username: "", password: "", name: "", email: "", mobile: "", address: "", birth: "", sex: "" };
    this.findMemberData= { username: "", name: "", email: "", mobile: "", type: "", method: "" };

    this.bestCategories = ["전체", "정육", "청과", "쌀잡곡", "계란", "유제품", "조미료", "과자류", "커피/음료"];
    this.saleCategories = ["전체", "정육", "쌀잡곡", "계란", "유제품", "조미료", "과자류", "커피/음료"];

    this.products = [
      { productId: "1", category: "청과", subCategory: "사과/배", name: "사과", price: 3000, discount: 1000, saleMethod: "fixed", saleCount: 2, imagePath: this.imageURL + "사과.jpg" },
      { productId: "2", category: "청과", subCategory: "사과/배", name: "배", price: 10000, discount: 10, saleMethod: "percent", saleCount: 4, imagePath: this.imageURL + "배.jpg" },
      { productId: "3", category: "청과", subCategory: "감/꽂감", name: "감귤", price: 5000, discount: 1500, saleMethod: "fixed", saleCount: 8, imagePath: this.imageURL + "감귤.png" },
      { productId: "4", category: "청과", subCategory: "감/꽂감", name: "황금향", price: 8000, discount: 10, saleMethod: "percent", saleCount: 6, imagePath: this.imageURL + "황금향.png" },
      { productId: "5", category: "청과", subCategory: "사과/배", name: "사과1", price: 9000, discount: 2000, saleMethod: "fixed", saleCount: 12, imagePath: this.imageURL + "사과1.png" },
      { productId: "6", category: "청과", subCategory: "감/꽂감", name: "감", price: 5000, discount: 1500, saleMethod: "fixed", saleCount: 6, imagePath: this.imageURL + "slide3.png" },
      { productId: "7", category: "청과", subCategory: "감/꽂감", name: "감", price: 5000, discount: 1500, saleMethod: "fixed", saleCount: 6, imagePath: this.imageURL + "slide3.png" },
      { productId: "8", category: "청과", subCategory: "감/꽂감", name: "감", price: 5000, discount: 1500, saleMethod: "fixed", saleCount: 6, imagePath: this.imageURL + "slide3.png" },
      { productId: "9", category: "청과", subCategory: "감/꽂감", name: "감", price: 5000, discount: 1500, saleMethod: "fixed", saleCount: 6, imagePath: this.imageURL + "slide3.png" },

      { productId: "101", category: "야채", subCategory: "고구마/감자",name: "고구마", price: 2500, discount: 5, saleMethod: "percent", saleCount: 8, imagePath: this.imageURL + "slide1.png" },
      { productId: "201", category: "과자류", subCategory: "제과",name: "빼빼로", price: 4000, discount: 1000, saleMethod: "fixed", saleCount: 1, imagePath: this.imageURL + "slide2.png" },
      { productId: "202", category: "과자류", subCategory: "초콜릿",name: "초콜릿", price: 7000, discount: 8, saleMethod: "percent", saleCount: 0, imagePath: this.imageURL + "slide3.png" },
      { productId: "301", category: "유제품", subCategory: "요거트/요구르트",name: "요구르트", price: 500, discount: 0, saleMethod: "none", saleCount: 12, imagePath: this.imageURL + "slide1.png" }
    ];
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
    
    return salePrice;
  }

  addShoppingBasket(item){
    let flag = false;
    
    for(let i=0; i<this.shoppingBasket.length; i++){
      if(item.name == this.shoppingBasket[i].name){
        flag = true;
      }
    }

    if(flag == false){
      this.shoppingBasket.push(item);
    }
  }

  calDeliveryFee(item){
    
  }
}
