import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { MemberProvider } from '../member/member';
import { ShoppingbasketProvider } from '../shoppingbasket/shoppingbasket';
import { OrderProvider } from '../order/order';
import { SearchProvider } from '../search/search';

// ip 218.145.181.49 //
/*
  Generated class for the ServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServerProvider {

  serverAddr: string = "http://218.145.181.49/ionic/";
  productImageURL: string = this.serverAddr +"images/";
  //productImageURL: string = "./assets/imgs/";
  shopTitle: string = "MARKET LUCKY";

  username: string;
  password: string;
  isMember: boolean;
  dataLoad = false;
  productAllCategories;

  bestCategories = new Array();
  saleCategories = new Array();
  deliveryPlaceInfos = [];

  products = new Array();
  homeProducts = new Array();
  categoryProducts = new Array();
  searchProducts = new Array();

  mobileOptionLists = ["010", "011", "018"];
  emailOptionLists = ["naver.com", "gmail.com", "daum.net", "outlook.com", "nate.com", "yahoo.com"];
  deliveryTimeLists = ["9:00 ~ 12:00", "12::00 ~ 15:00", "15:00 ~ 18:00", "18:00 ~ 21:00"];
  deliveryMemoLists = ["부재시 경비실에 맡겨주세요", "오시기 전에 미리 연락주세요", "빨리 배송해주세요"];

  constructor(public http: Http, private memberProvider: MemberProvider, private shoppingbasketProvider:ShoppingbasketProvider,
    public orderProvivder:OrderProvider, public searchProvider:SearchProvider) {
    console.log('Hello ServerProvider Provider');
    this.isMember = false;
    this.bestCategories = [{ subCategoryName: "전체" }, { subCategoryName: "과일·견과", subCategoryCode: "103" }, { subCategoryName: "유제품", subCategoryCode: "201" }, { subCategoryName: "과자·빵", subCategoryCode: "202" }];
    this.saleCategories = [{ subCategoryName: "전체" }, { subCategoryName: "과일·견과", subCategoryCode: "103" }, { subCategoryName: "유제품", subCategoryCode: "201" }, { subCategoryName: "과자·빵", subCategoryCode: "202" }];
  }

  init(){
    return new Promise((resolve, reject) => {
      this.http.get(this.serverAddr + "init.php").subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          if (result.product == null) {
            this.homeProducts = [];
          } else {
            this.homeProducts = this.productRearrange(result.product);
          }
          console.log("product load Success");
          
          this.productAllCategories = this.categoryRearrange(result.category);
          for (let i = 0; i < this.productAllCategories.length; i++) {
            this.productAllCategories[i].selected = false;
          }
          console.log("categoryload Success");

          if(result.searchWord != undefined){
            this.searchProvider.popularSearchItems = result.searchWord;
          }

          resolve("success");
        }
        else {
          console.log("product load fail");
          reject("fail");
        }
      }, err => {
        console.log(err);
      });
    });    
  }

  getAllProductData(){
    //상품 정보를 가져옴
    return new Promise((resolve, reject) => {
      this.http.get(this.serverAddr + "product/loadAllProduct.php").subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("product load Success");
          if (result == null) {
            this.products = [];
            resolve("noItem");
          }else{
            this.products = this.productRearrange(result.product);
            resolve("success");
          }
        }
        else {
          console.log("product load fail");
          reject("fail");
        }
      }, err => {
        console.log(err);
      });
    });    
  }

  getCategoryProductData(categoryCode){
    //특정 카테고리 상품 정보를 가져옴
    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "product/loadCategoryProduct.php", categoryCode).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if(result.product == undefined){
          this.categoryProducts = [];
          resolve("noItem");
        }else{
          this.categoryProducts = this.productRearrange(result.product);
          resolve("success");
        }
      }, err => {
        console.log(err);
      });
    }); 
  }

  loadCategory(){
    return new Promise((resolve, reject) => {
      this.http.get(this.serverAddr + "category/loadCategory.php").subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("categoryload Success");
          this.productAllCategories = this.categoryRearrange(result.category);
          for (let i = 0; i < this.productAllCategories.length; i++) {
            this.productAllCategories[i].selected = false;
          }
          resolve("success");
        }
        else {
          console.log("category load fail");
          reject("fail");
        }
      }, err => {
        console.log(err);
      });
    });    
  }

  signup(memberData){
    return new Promise((resolve, reject)=>{
      this.http.post(this.serverAddr + "signup/signup.php", memberData).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("signup Success");
          resolve("success");
        }
        else {
          console.log("Fail signup");
          reject("fail");
        }
      }, err => {
        console.log(err);
      });
    });    
  }

  checkIDDuplication(memberID){
    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "signup/checkIDDuplication.php", memberID).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "none") {
          console.log("ID doesn't exist");
          resolve("none");
        }
        else {
          console.log("ID is exist");
          reject("exist");
        }
      }, err => {
        console.log(err);
      });
    });    
  }

  modify(memberData){
    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "member/modify.php", memberData).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("signup Success");
          this.memberProvider.memberData = memberData;
          resolve("success");
        }
        else {
          console.log("Fail signup");
          reject("fail");
        }
      }, err => {
        console.log(err);
      });
    });   
  }

  login(memberID, password){
    let body = {memberID, password};

    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "member/login.php", body).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("login success");
          
          // 회원정보 로드
          this.isMember = true;
          this.memberProvider.memberData.username = memberID;
          this.memberProvider.memberData.password = password;
          this.memberProvider.memberData.birth = result.memberBirth;
          this.memberProvider.memberData.name = result.memberName;
          this.memberProvider.memberData.mobile = result.mobile;
          this.memberProvider.memberData.email = result.email;
          this.memberProvider.memberData.sex = result.memberSex;
          this.memberProvider.memberData.UID = result.memberUID;

          this.memberProvider.deliveryAddrs = result.address;

          // 장바구니 정보 로드
          if(result.shoppingbasket.length != 0){
            this.updateShoppingbasket(result);
          }else{
            this.shoppingbasketProvider.shoppingBasket.orderedProducts = [];
          }

          // 주문 정보 로드
          if(result.orderInfos.length != 0){
            this.orderProvivder.orderInfos = this.orderInfoRearrange(result.orderInfos);
          }else{
            this.orderProvivder.orderInfos = [];
          }

          // 최근 검색 기록 로드
          if(result.recentSearch != undefined){
            this.searchProvider.recentSearchItems = result.recentSearch;
          }else{
            this.searchProvider.recentSearchItems = [];
          }
          resolve("success");
        }
        else {
          console.log("dismatch ID and password");
          reject("failed");
        }
      }, err => {
        console.log(err);
      });
    });    
  }

  findMemberData(findMemberData){
    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "member/findMemberData.php", findMemberData).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("find success");
          resolve(result);
        }
        else {
          console.log("find access failed");
          reject("failed");
        }
      }, err => {
        console.log(err);
      });
    });
  }

  alterDeliveryAddr(deliveryAddrs, type){
    deliveryAddrs['type']=type;
    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "member/alterDeliverAddr.php", deliveryAddrs).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("alter address success");
          this.memberProvider.deliveryAddrs = result.address;
          resolve("success");
        }
        else {
          console.log("alter address failed");
          reject("failed");
        }
      }, err => {
        console.log(err);
      });
    });
  }

  addShoppingbasket(product){
    let body = {memberUID : this.memberProvider.memberData.UID, productCode:product.productCode, priceID:product.priceID, productStockID:product.productStockID};

    this.http.post(this.serverAddr + "member/addShoppingbasket.php", body).subscribe(data => {
      console.log(data);
      let result = JSON.parse(data["_body"]);
      if (result.status == "success") {
        if (result.shoppingbasket.length != 0) {
          this.updateShoppingbasket(result);
        }else{
          this.shoppingbasketProvider.shoppingBasket.orderedProducts = [];
        }
        
        console.log("add shoppingbasket success");
      }
      else {
        console.log("add shoppingbasket failed");
      }
    }, err => {
      console.log(err);
    });
  }

  delShoppingbasket(product){
    let delProducts = [];
    
    for(let i = 0; i<product.length; i++){
      delProducts.push({ productCode: product[i].productCode, priceID: product[i].priceID, productStockID: product[i].productStockID });
    }

    let body = {memberUID: this.memberProvider.memberData.UID, products:delProducts};

    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "member/delShoppingbasket.php", body).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("del shoppingbasket success");
          // 장바구니 정보 로드
          if (result.shoppingbasket.length != 0) {
            this.updateShoppingbasket(result);
          } else {
            this.shoppingbasketProvider.shoppingBasket.orderedProducts = [];
            this.shoppingbasketProvider.shoppingBasket.checkedProducts = [];
          }
          resolve("success");
        }
        else {
          console.log("del shoppingbasket failed");
          reject("failed");
        }
      }, err => {
        console.log(err);
      });
    });
  }

  loadShoppingbasket(){
    let memberUID = this.memberProvider.memberData.UID;
    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "member/loadShoppingbasket.php", memberUID).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("load shoppingbasket success");
          // 장바구니 정보 로드
          if (result.shoppingbasket.length != 0) {
            this.updateShoppingbasket(result);
          } else {
            this.shoppingbasketProvider.shoppingBasket.orderedProducts = [];
          }
          resolve("success");
        }
        else {
          console.log("load shoppingbasket failed");
          reject("failed");
        }
      }, err => {
        console.log(err);
      });
    });
  }

  orderProducts(orderInfo, prevPage){
    let addr = "";
    let body;
    if (this.isMember == true){
      let memberUID = this.memberProvider.memberData.UID;
      body = { memberUID, orderInfo };
      if (prevPage == "shoppingbasket") {
        addr = "member/order/orderProductsShoppingbasket.php";
      }else{
        addr = "member/order/orderProducts.php";
      }
    }else {
      body = { orderInfo };
      addr = "nonMember/order/orderProducts.php";
    }
    
    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + addr, body).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("order Success");
          this.orderProvivder.orderInfos = this.orderInfoRearrange(result.orderInfo);
          if (this.isMember == true && prevPage == "shoppingbasket"){
            // 장바구니 정보 로드
            if (result.shoppingbasket.length != 0) {
              this.updateShoppingbasket(result);
            } else {
              this.shoppingbasketProvider.shoppingBasket.orderedProducts = [];
            }
          }
          resolve("success");
        } else if(result.status == "invalid"){
          console.log("order Invalid");
          if (this.isMember == true && prevPage == "shoppingbasket") {
            // 장바구니 정보 로드
            if (result.shoppingbasket.length != 0) {
              this.updateShoppingbasket(result);
            } else {
              this.shoppingbasketProvider.shoppingBasket.orderedProducts = [];
            }
          } else if (this.isMember == false){
            this.shoppingbasketProvider.completeShopping();
          }
          resolve("invalid");
        }
        else {
          console.log("Fail order");
          reject("fail");
        }
      }, err => {
        console.log(err);
      });
    }); 
  }

  loadOrderDetail(orderID){
    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "order/loadOrderProductDetail.php", orderID).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log(" Success");
          let orderInfos = this.orderProvivder.orderInfos;
          for (let i = 0; i < orderInfos.length; i++){
            if (orderInfos[i].orderID == orderID){
              //let path = "http://218.145.181.49/ionic/images/";
              //let path = "./assets/imgs/";
              let path = this.productImageURL;
              
              orderInfos[i].orderedProducts = result['orderedProducts'];

              for(let j = 0; j < orderInfos[i].orderedProducts.length; j++){
                orderInfos[i].orderedProducts[j].imagePath = path + orderInfos[i].orderedProducts[j].imagePath;
              }
            }
          }
          resolve("success");
        }
        else {
          console.log("Fail load order detail");
          reject("fail");
        }
      }, err => {
        console.log(err);
      });
    }); 
  }

  cancelOrder(orderInfo){
    return new Promise((resolve, reject) => {

      let addr = "";
      if (this.isMember == true) {
        orderInfo['memberUID'] = this.memberProvider.memberData.UID;
        addr = "member/order/cancelOrder.php";
      } else {
        addr = "nonMember/order/cancelOrder.php";
      }
      
      this.http.post(this.serverAddr + addr, orderInfo).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log(" Success");
          if (result.orderInfos != undefined) {
            this.orderProvivder.orderInfos = this.orderInfoRearrange(result.orderInfos);
          } else {
            this.orderProvivder.orderInfos = [];
          }
          resolve("success");
        }
        else {
          console.log("Fail cancelOrder");
          reject("fail");
        }
      }, err => {
        console.log(err);
      });
    }); 
  }

  searchItem(searchWord){
    let memberUID = this.memberProvider.memberData.UID;
    let body = {memberUID , searchWord};

    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "search/search.php", body).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log(" Success");
          if(result['product'] != undefined){
            this.searchProducts = this.productRearrange(result.product);
            resolve("success");
          }else{
            this.searchProducts = [];
            resolve("noItem");
          }
        }
        else {
          console.log("Fail cancelOrder");
          reject("fail");
        }
      }, err => {
        console.log(err);
      });
    }); 
  }

  categoryRearrange(data){
    let classCategory = null;
    let subCategory = { subCategoryCode: "", subCategoryName:""};
    let subCategories = [];
    let categoryData = { generalCategoryName: "", generalCategoryCode: "", category: "", categoryCode: "", subCategories: []};
    let categoryDatas = [];

    for(let i=0; i<data.length; i++){

      if(classCategory != data[i]['classCategoryName']){
        classCategory = data[i]['classCategoryName'];

        if(i!=0){
          categoryData.subCategories = JSON.parse(JSON.stringify(subCategories));
          subCategories.length = 0;
          categoryDatas.push(JSON.parse(JSON.stringify(categoryData)));
        }
        subCategory.subCategoryName = "전체";
        subCategories.push(JSON.parse(JSON.stringify(subCategory)));

        categoryData.generalCategoryName = data[i]['generalCategoryName'];
        categoryData.generalCategoryCode = data[i]['generalCategoryCode'];
        categoryData.category = classCategory;
        categoryData.categoryCode = data[i]['classCategoryCode'];
      }
      subCategory.subCategoryCode = data[i]['categoryCode'];
      subCategory.subCategoryName = data[i]['categoryName'];
      subCategories.push(JSON.parse(JSON.stringify(subCategory)));
      
      if(i == (data.length - 1)){
        categoryData.subCategories = JSON.parse(JSON.stringify(subCategories));
        categoryDatas.push(JSON.parse(JSON.stringify(categoryData)));
      }
    }

    return categoryDatas;
  }

  productRearrange(data){

    //let path = "http://218.145.181.49/ionic/images/";
    //let path = "./assets/imgs/";
    let path = this.productImageURL;

    for (let i = 0; i < data.length; i++) {
      data[i].imagePath = path + data[i].imagePath;
      data[i].endDate = data[i].endDate.date;
      data[i].startDate = data[i].startDate.date;
    }
    /*for(let i = 0; i<data['product'].length; i++){
      while (j < data['imagePath'].length && data['product'][i].productCode == data['imagePath'][j].productCode){
        data['imagePath'][j].imagePath = path + data['imagePath'][j].imagePath;
        imagePaths.push(JSON.parse(JSON.stringify(data['imagePath'][j])));
        j++;
      }

      let product = data['product'][i];
      product['imagePath'] = imagePaths;
      products.push(JSON.parse(JSON.stringify(product)));
      imagePaths.length = 0;
    }*/

    return data;
  }

  orderInfoRearrange(data) {
    let orderInfos = [];
    let memberInfo = this.memberProvider.memberData;
    
    for (let i = 0; i < data.length; i++){

      let customInfo = {
        ordererName: memberInfo.name, ordererMobile: memberInfo.mobile, ordererEmail: memberInfo.email, receiverName: data[i].receiverName, 
        receiverAddress: data[i].receiverAddress, receiverMobile: data[i].receiverMobile };
      
      let orderInfo = {
        type: "member", customInfo: customInfo, orderPrice: data[i].orderPrice, orderName: data[i].orderName, sale: data[i].totalSale, 
        regDate: data[i].orderDate.date.substr(0, 19), orderID: data[i].orderID, deliveryFee: data[i].deliveryFee, count: data[i].orderCount, 
        totalPrice: data[i].totalPrice, paymentMethod: data[i].paymentMethod, paymentID:data[i].paymentID, orderStatus: data[i].orderStatus, deliveryTime: data[i].deliveryTime, 
        deliveryMemo: data[i].orderMemo, orderedProducts: [], 
      };

      orderInfos.push(JSON.parse(JSON.stringify(orderInfo)));
    }
    return orderInfos;
  }

  updateShoppingbasket(result){
    let products = this.productRearrange(result.shoppingbasket);
    let shoppingBasket = this.shoppingbasketProvider.shoppingBasket;
    shoppingBasket.orderedProducts = products;
    shoppingBasket.checkedProducts = [];

    for (let i = 0; i < shoppingBasket.orderedProducts.length; i++) {
      shoppingBasket.checkedProducts.push(true);
      shoppingBasket.orderedProducts[i].count = 1;
    }
    shoppingBasket.checkedAllProducts = true;
  }

  /*addShoppingBasket(item) {
    let flag = false;

    for (let i = 0; i < this.shoppingBasket.length; i++) {
      if (item.name == this.shoppingBasket[i].name) {
        flag = true;
      }
    }

    if (flag == false) {
      this.shoppingBasket.push(item);
    }
  }*/
}
