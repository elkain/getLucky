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
  deliveryPlaceInfos = [];

  shoppingBasket = Array();
  nonMemberOrderInfo = {};
  memberOrderInfo = {};

  products = new Array();

  mobileOptionLists = ["010", "011", "018"];
  emailOptionLists = ["naver.com", "gmail.com", "daum.net", "outlook.com", "nate.com", "yahoo.com"];
  deliveryTimeLists = ["9:00 ~ 12:00","12::00 ~ 15:00", "15:00 ~ 18:00", "18:00 ~ 21:00"];
  deliveryMemoLists = ["부재시 경비실에 맡겨주세요", "오시기 전에 미리 연락주세요", "빨리 배송해주세요"];

  productImageURL: string = "./assets/imgs/"

  constructor() {
    console.log('Hello StorageProvider Provider');
    this.isMember = false;
    this.popularSearchItems = ["가", "나", "다"];

    //this.bestCategories = ["전체", "정육", "청과", "쌀잡곡", "계란", "유제품", "조미료", "과자류", "커피/음료"];
    this.bestCategories = [{ categoryName: "전체" }, { categoryName: "과일·견과", categoryCode: "103" }, { categoryName: "유제품", categoryCode: "201" }, { categoryName: "과자·빵", categoryCode: "202" }];
    this.saleCategories = [{ categoryName: "전체" }, { categoryName: "과일·견과", categoryCode: "103" }, { categoryName: "유제품", categoryCode: "201" }, { categoryName: "과자·빵", categoryCode: "202" }];

    /*this.products = [
      { productId: "1", category: "청과", subCategory: "사과/배", name: "사과", price: 3000, discount: 1000, saleMethod: "fixed", saleCount: 2, imagePath: this.productImageURL + "사과.jpg" },
      { productId: "2", category: "청과", subCategory: "사과/배", name: "배", price: 10000, discount: 10, saleMethod: "percent", saleCount: 4, imagePath: this.productImageURL + "배.jpg" },
      { productId: "3", category: "청과", subCategory: "감/꽂감", name: "감귤", price: 5000, discount: 1500, saleMethod: "fixed", saleCount: 8, imagePath: this.productImageURL + "감귤.jpg" },
      { productId: "4", category: "청과", subCategory: "감/꽂감", name: "황금향", price: 8000, discount: 10, saleMethod: "percent", saleCount: 6, imagePath: this.productImageURL + "황금향.jpg" },
      { productId: "5", category: "청과", subCategory: "사과/배", name: "사과1", price: 9000, discount: 2000, saleMethod: "fixed", saleCount: 12, imagePath: this.productImageURL + "사과1.jpg" },
      { productId: "6", category: "청과", subCategory: "바나나", name: "바나나", price: 2980, discount: 10, saleMethod: "percent", saleCount: 20, imagePath: this.productImageURL + "바나나.jpg" },
      { productId: "7", category: "청과", subCategory: "청포도", name: "청포도", price: 598, discount: 50, saleMethod: "fixed", saleCount: 6, imagePath: this.productImageURL + "청포도.jpg" },
      { productId: "8", category: "청과", subCategory: "수박/멜론", name: "수박", price: 23800, discount: 2000, saleMethod: "fixed", saleCount: 3, imagePath: this.productImageURL + "수박.jpg" },
      { productId: "9", category: "청과", subCategory: "수박/멜론", name: "멜론", price: 11900, discount: 1000, saleMethod: "fixed", saleCount: 15, imagePath: this.productImageURL + "멜론.jpg" },
      { productId: "10", category: "청과", subCategory: "딸기", name: "딸기", price: 5000, discount: 5, saleMethod: "percent", saleCount: 15, imagePath: this.productImageURL + "딸기.jpg" },
      { productId: "11", category: "청과", subCategory: "딸기", name: "딸기1", price: 6000, discount: 500, saleMethod: "fixed", saleCount: 15, imagePath: this.productImageURL + "딸기1.jpg" },
      { productId: "12", category: "청과", subCategory: "감/꽃감", name: "단감", price: 4480, discount: 10, saleMethod: "percent", saleCount: 15, imagePath: this.productImageURL + "감.jpg" },
      { productId: "13", category: "청과", subCategory: "감/꽃감", name: "꽂감", price: 11900, discount: 1000, saleMethod: "fixed", saleCount: 15, imagePath: this.productImageURL + "꽂감.jpg" },
      { productId: "14", category: "청과", subCategory: "바나나", name: "바나나1", price: 11900, discount: 1000, saleMethod: "fixed", saleCount: 15, imagePath: this.productImageURL + "바나나1.jpg" },
      { productId: "101", category: "야채", subCategory: "고구마/감자", name: "고구마", price: 2500, discount: 5, saleMethod: "percent", saleCount: 8, imagePath: this.productImageURL + "고구마.jpg" },
      { productId: "201", category: "과자류", subCategory: "제과", name: "빼빼로", price: 4000, discount: 1000, saleMethod: "fixed", saleCount: 1, imagePath: this.productImageURL + "빼빼로.jpg" },
      { productId: "202", category: "과자류", subCategory: "초콜릿", name: "초콜릿", price: 7000, discount: 8, saleMethod: "percent", saleCount: 0, imagePath: this.productImageURL + "초콜렛.jpg" },
      { productId: "301", category: "유제품", subCategory: "요거트/요구르트", name: "요구르트", price: 500, discount: 0, saleMethod: "none", saleCount: 12, imagePath: this.productImageURL + "요구르트.jpg" },
      { productId: "303", category: "유제품", subCategory: "요거트/요구르트", name: "휴지", price: 500, discount: 0, saleMethod: "none", saleCount: 12, imagePath: this.productImageURL + "휴지.jpg" },
      { productId: "304", category: "유제품", subCategory: "요거트/요구르트", name: "각 휴지", price: 500, discount: 0, saleMethod: "none", saleCount: 12, imagePath: this.productImageURL + "각휴지.jpg" }
    ];*/
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
