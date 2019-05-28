import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { MemberProvider } from '../member/member';
import { ShoppingbasketProvider } from '../shoppingbasket/shoppingbasket';
import { OrderProvider } from '../order/order';
import { SearchProvider } from '../search/search';
import { Storage } from '@ionic/storage';

// ip 218.145.181.49 //
/*
  Generated class for the ServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServerProvider {

  //serverAddr: string = "http://218.145.181.49/ionic/";
  //serverAddr: string = "http://218.145.181.49/ionic/mysql/";
  //serverAddr: string = "http://49.247.131.13/ionic/mysql/";
  //serverAddr: string = "http://172.30.1.50/ionic/mysql/";
  serverAddr: string = "http://192.168.56.101/ionic/mysql/";
  //productImageURL: string = "http://49.247.131.13/ionic/images/";
  productImageURL: string = this.serverAddr+"images/";
  //productImageURL: string = "./assets/imgs/";
  shopTitle: string = "MARKET LUCKY";

  username: string;
  password: string;
  isMember: boolean;
    
  dataLoad = false;
  productAllCategories;

  homeCategories = new Array();
  homeSubcategories = new Array();
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
    public orderProvivder: OrderProvider, public searchProvider: SearchProvider, private storage: Storage, public alertCtrl:AlertController) {
    console.log('Hello ServerProvider Provider');
    this.isMember = false;
  }

  init(){
    return new Promise((resolve, reject) => {
      this.http.get(this.serverAddr + "init.php").subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {

          if (result.displayShopCategory != undefined && result.displayShopCategory != null){
            this.homeCategories = result.displayShopCategory;
          } else {
            console.log("load displayShop Category error");
          }

          if (result.displayShop != undefined && result.displayShop != null) {
            this.homeSubcategories = result.displayShop;
          } else {
            console.log("load displayShop error");
          }

          if (result.product != null) {
            this.homeProducts = result.product;
          } else {
            this.homeProducts = [];
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

  refreshHomeProductsData(){
    return new Promise((resolve, reject) => {
      this.http.get(this.serverAddr + "product/refreshHomeProductsData.php").subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if(result.status == "success"){
          if (result.product != undefined && result.product != null){
            this.homeProducts = result.product;
            resolve("success");
          }else{
            this.homeProducts = [];
            reject("no Item");
          }
        }
      }, err => {
        console.log(err);
        reject(err);
      });
    }); 
  }

  /*getAllProductData(offset = 0){
    //상품 정보를 가져옴
    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "product/loadAllProduct.php", offset).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success" && result != undefined) {
          console.log("product load Success");
          if (result.product == undefined || result.product == null) {
            resolve("noItem");
          }else{
            if(offset > 0){
              let products = result.product;              
              for(let i = 0; i<products.length; i++){
                this.homeProducts.push(products[i]);
              }
            }else{
              this.homeProducts = result.product;
            }
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
  }*/

  getCategoryProductData(categoryCode){
    //특정 카테고리 상품 정보를 가져옴
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then((val)=>{
        let body = { categoryCode, auth: val };
        this.http.post(this.serverAddr + "product/loadCategoryProduct.php", body).subscribe(data => {
          console.log(data);
          let result = JSON.parse(data["_body"]);
          if (result.product == undefined) {
            this.categoryProducts = [];
            this.storage.set('auth', result.auth.auth);
            resolve("noItem");
          } else if(result.auth == 'expired'){
            this.isMember = false;
            this.memberProvider.logout();
            this.storage.remove('auth');
            reject("expired");
          }else {
            this.storage.set('auth', result.auth.auth);
            this.categoryProducts = result.product;
            resolve("success");
          }
        }, err => {
          console.log(err);
        });
      });
    }); 
  }

  getMoreCategoryProductData(categoryCode, offset) {
    //특정 카테고리 상품 정보를 좀더 가져옴
    let body = { categoryCode, offset }
    return new Promise((resolve, reject) => {
      this.http.post(this.serverAddr + "product/loadMoreCategoryProduct.php", body).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.product != undefined && result.product != null) {
          let products = result.product;
          for (let i = 0; i < products.length; i++) {
            this.categoryProducts.push(products[i]);
          }

          if (products.length < 20) {
            resolve("loadEnd");
          } else {
            resolve("success");
          }
        } else {
          this.categoryProducts = [];
          resolve("noItem");
        } 
      }, err => {
        console.log(err);
      });
    });
  }

  /*loadCategory(){
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
  }*/

  signup(memberData){
    return new Promise((resolve, reject)=>{
      this.http.post(this.serverAddr + "signup/signup.php", memberData).subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          this.storage.set('auth',result.auth);
          // set a key/value
          console.log("signup Success");
          resolve("success");
        }
        else {
          // set a key/value
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

  modify(memberData, currentPassword){
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then((val) => {
        let body = { memberData: memberData, currentPassword: currentPassword, auth: val };
        this.http.post(this.serverAddr + "member/modify.php", body).subscribe(data => {
          console.log(data);
          let result = JSON.parse(data["_body"]);
          if (result.status == "success") {
            this.storage.set('auth', result.auth);
            this.memberProvider.memberData = memberData;
            
            resolve("success");
          } else if (result.status == 'expired' || result.status == 'not exist') {
            this.isMember = false;
            this.memberProvider.logout();
            this.storage.remove('auth');
            reject('expired')
          } else {
            console.log("dismatch ID and password");
            reject("failed");
          }
        }, err => {
          console.log(err);
        });
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

          // refresh access Key
          this.storage.set('auth', result.auth);
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
            this.shoppingbasketProvider.shoppingBasket.checkedProducts = [];
            this.shoppingbasketProvider.shoppingBasket.checkedAllProducts = false;
          }

          // 주문 정보 로드
          this.orderProvivder.orderInfos = [];
          if(result.orderInfos.length != 0){
            this.orderProvivder.orderInfos = this.orderInfoRearrange(result.orderInfos);
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
          this.storage.remove('auth');
          console.log("dismatch ID and password");
          reject("failed");
        }
      }, err => {
        this.storage.remove('auth');
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
      this.storage.get('auth').then((val)=>{
        let body = {auth:val, deliveryAddrs};
        this.http.post(this.serverAddr + "member/alterDeliverAddr.php", body).subscribe(data => {
          console.log(data);
          let result = JSON.parse(data["_body"]);
          if (result.status == "success") {
            console.log("alter address success");
            this.storage.set('auth', result.auth);
            if (result.address == null) {
              this.memberProvider.deliveryAddrs = [];
            } else {
              this.memberProvider.deliveryAddrs = result.address;
            }
            resolve("success");
          } else if (result.status == 'expired') {
            this.isMember = false;
            this.memberProvider.logout();
            this.storage.remove('auth');
            reject('expired')
          } else {
            console.log("alter address failed");
            reject("failed");
          }
        }, err => {
          console.log(err);
        });
      });
    });
  }

  addShoppingbasket(product){
    return new Promise((resolve, reject)=>{
      this.storage.get('auth').then((val) => {
        let body = { auth: val, productCode: product.productCode, priceID: product.priceID, productStockID: product.productStockID };
        this.http.post(this.serverAddr + "member/addShoppingbasket.php", body).subscribe(data => {
          let result = JSON.parse(data["_body"]);
          
          if (result.status == "success") {
            this.storage.set('auth', result.auth);

            if (result.shoppingbasket.length != 0) {
              this.updateShoppingbasket(result);
            } else {
              this.shoppingbasketProvider.shoppingBasket.orderedProducts = [];
              this.shoppingbasketProvider.shoppingBasket.checkedProducts = [];
              this.shoppingbasketProvider.shoppingBasket.checkedAllProducts = false;
            }
            console.log("add shoppingbasket success");
            resolve('success');
          } else {
            this.storage.remove('auth');
            this.isMember = false;
            this.memberProvider.logout();
            reject('expired');
            console.log("add shoppingbasket failed");
          }
        }, err => {
          console.log(err);
        });
      }); 
    });
  }

  delShoppingbasket(product){
    let delProducts = [];
    
    for(let i = 0; i<product.length; i++){
      delProducts.push({ productCode: product[i].productCode, priceID: product[i].priceID, productStockID: product[i].productStockID });
    }
    
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then((val) => {
        let body = { auth: val, products: delProducts };
        this.http.post(this.serverAddr + "member/delShoppingbasket.php", body).subscribe(data => {
          console.log(data);
          let result = JSON.parse(data["_body"]);
          if (result.status == "success") {
            console.log("del shoppingbasket success");
            this.storage.set('auth', result.auth);
            // 장바구니 정보 로드
            if (result.shoppingbasket.length != 0) {
              this.updateShoppingbasket(result);
            } else {
              this.shoppingbasketProvider.shoppingBasket.orderedProducts = [];
              this.shoppingbasketProvider.shoppingBasket.checkedProducts = [];
              this.shoppingbasketProvider.shoppingBasket.checkedAllProducts = false;
            }
            resolve("success");
          }
          else {
            console.log("del shoppingbasket failed");
            this.storage.remove('auth');
            this.isMember = false;
            this.memberProvider.logout();
            reject('expired');
          }
        }, err => {
          console.log(err);
        });
      });
    });
  }

  /*loadShoppingbasket(){
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
            this.shoppingbasketProvider.shoppingBasket.checkedProducts = [];
            this.shoppingbasketProvider.shoppingBasket.checkedAllProducts = false;
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
  }*/

  orderProducts(orderInfo, prevPage, isMember){
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then((val)=>{
        let addr = "";
        let body = { auth: val, orderInfo };
        if (isMember == true) {
          if (prevPage == "shoppingbasket") {
            addr = "member/order/orderProductsShoppingbasket.php";
          } else {
            addr = "member/order/orderProducts.php";
          }
        } else {
          addr = "nonMember/order/orderProducts.php";
        }
        this.http.post(this.serverAddr + addr, body).subscribe(data => {
          console.log(data);
          let result = JSON.parse(data["_body"]);
          if (result.status == "success") {
            console.log("order Success");
            if(this.isMember == true){
              this.storage.set('auth', result.auth);
            }
            this.orderProvivder.orderInfos = this.orderInfoRearrange(result.orderInfo);
            if (isMember == true && prevPage == "shoppingbasket") {
              // 장바구니 정보 로드
              if (result.shoppingbasket.length != 0) {
                this.updateShoppingbasket(result);
              } else {
                this.shoppingbasketProvider.shoppingBasket.orderedProducts = [];
                this.shoppingbasketProvider.shoppingBasket.checkedProducts = [];
                this.shoppingbasketProvider.shoppingBasket.checkedAllProducts = false;
              }
            }
            resolve("success");
          } else if (result.status == "invalid") {
            console.log("order Invalid");
            if (isMember == true && prevPage == "shoppingbasket") {
              // 장바구니 정보 로드
              if (result.shoppingbasket.length != 0) {
                this.updateShoppingbasket(result);
              } else {
                this.shoppingbasketProvider.shoppingBasket.orderedProducts = [];
              }
            } else if (isMember == false) {
              this.shoppingbasketProvider.completeShopping();
            }
            resolve("invalid");
          } else if (result.status == "expired") {
            console.log("session expired");
            this.storage.remove('auth');
            this.isMember = false;
            this.memberProvider.logout();
            reject("expired");
          } else {
            console.log("Fail order");
            reject("fail");
          }
        }, err => {
          console.log(err);
        });
      }); 
    });
  }

  loadOrderInfo(offset = 0){
    //let memberUID = this.memberProvider.memberData.UID;
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then((val)=>{
        let body = { offset, auth:val };
        this.http.post(this.serverAddr + "member/order/loadOrderInfo.php", body).subscribe(data => {
          console.log(data);
          let result = JSON.parse(data["_body"]);
          if (result.status == "success") {
            console.log(" Success");
            this.storage.set('auth', result.auth);

            if (offset > 0) {
              if (result.orderInfos.length != 0) {
                let orderInfos = this.orderInfoRearrange(result.orderInfos);
                for (let i = 0; i < orderInfos.length; i++) {
                  this.orderProvivder.orderInfos.push(orderInfos[i]);
                }
              }
            } else {
              this.orderProvivder.orderInfos = [];
              if (result.orderInfos.length != 0) {
                this.orderProvivder.orderInfos = this.orderInfoRearrange(result.orderInfos);
              }
            }
            resolve("success");
          } else if (result.status == "expired") {
            console.log("session expired");
            this.storage.remove('auth');
            this.isMember = false;
            this.memberProvider.logout();
            reject("expired");
          }
          else {
            console.log("Fail load order detail");
            reject("fail");
          }
        }, err => {
          console.log(err);
        });
      }); 
    });
  }

  loadOrderDetail(orderID, name){
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then((val)=>{
        let body: any;
        let path: string;
        if (name == null) {
          body = {orderID, auth:val};
          path = "member/order/loadOrderProductDetail.php";
        } else {
          body = { orderID, name, auth:val };
          path = "nonMember/order/loadOrderProductDetail.php";
        }
      
        this.http.post(this.serverAddr + path, body).subscribe(data => {
          console.log(data);
          let result = JSON.parse(data["_body"]);
          if (result.status == "success") {
            console.log(result);
            if(name == null){
              this.storage.set('auth', result.auth);
            }

            if (result.orderedProducts != undefined) {
              let orderInfos;
              if (name != null) {
                this.orderProvivder.orderInfos = this.orderInfoRearrange(result.orderInfo);
              }

              orderInfos = this.orderProvivder.orderInfos;

              for (let i = 0; i < orderInfos.length; i++) {
                if (orderInfos[i].orderID == orderID) {
                  //let path = "http://218.145.181.49/ionic/images/";
                  //let path = "./assets/imgs/";
                  let path = this.productImageURL;

                  orderInfos[i].orderedProducts = result['orderedProducts'];

                  for (let j = 0; j < orderInfos[i].orderedProducts.length; j++) {
                    orderInfos[i].orderedProducts[j].imagePath = path + orderInfos[i].orderedProducts[j].imagePath;
                  }
                }
              }
              resolve("success");
            } else {
              resolve("noItem");
            }
          } else if(result.status == 'expired') {
            console.log("session expired");
            this.storage.remove('auth');
            this.isMember = false;
            this.memberProvider.logout();
            reject("expired");
          }
          else {
            console.log("Fail load order detail");
            reject("fail");
          }
        }, err => {
          console.log(err);
          reject(err);
        });
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
        }else if(result.status == "invalid"){
          resolve("invalid");
        } else if (result.status == "processing"){
          resolve("processing");
        }
        else{
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

  /*productRearrange(data){

    //let path = "http://218.145.181.49/ionic/images/";
    //let path = "./assets/imgs/";
    let path = this.productImageURL;

    for (let i = 0; i < data.length; i++) {
      data[i].imagePath = path + data[i].imagePath;
      if (data[i].endDate != null){
        data[i].endDate = data[i].endDate.date;
      }
      
      if (data[i].startDate != null){
        data[i].startDate = data[i].startDate.date;
      }
      
    }
    for(let i = 0; i<data['product'].length; i++){
      while (j < data['imagePath'].length && data['product'][i].productCode == data['imagePath'][j].productCode){
        data['imagePath'][j].imagePath = path + data['imagePath'][j].imagePath;
        imagePaths.push(JSON.parse(JSON.stringify(data['imagePath'][j])));
        j++;
      }

      let product = data['product'][i];
      product['imagePath'] = imagePaths;
      products.push(JSON.parse(JSON.stringify(product)));
      imagePaths.length = 0;
    }

    return data;
  }*/

  orderInfoRearrange(data) {
    let orderInfos = [];
    let memberInfo = this.memberProvider.memberData;
    
    for (let i = 0; i < data.length; i++){
      let customInfo;
      if(data[i].nonMemberID == undefined){
        customInfo = {
          ordererName: memberInfo.name, ordererMobile: memberInfo.mobile, ordererEmail: memberInfo.email, receiverName: data[i].receiverName,
          receiverAddress: data[i].receiverAddress, receiverMobile: data[i].receiverMobile
        };
      }else{
        customInfo = {
          ordererName: data[i].customName, ordererMobile: data[i].customMobile, ordererEmail: data[i].customEmail, receiverName: data[i].receiverName,
          receiverAddress: data[i].receiverAddress, receiverMobile: data[i].receiverMobile
        };
      }
      
      let orderInfo = {
        type: "member", customInfo: customInfo, orderPrice: data[i].orderPrice, orderName: data[i].orderName, sale: data[i].totalSale, 
        regDate: data[i].orderDate, orderID: data[i].orderID, deliveryFee: data[i].deliveryFee, count: data[i].orderCount, 
        totalPrice: data[i].totalPrice, paymentMethod: data[i].paymentMethod, paymentID:data[i].paymentID, orderStatus: data[i].orderStatus, deliveryTime: data[i].deliveryTime, 
        deliveryMemo: data[i].orderMemo, orderedProducts: [], 
      };

      orderInfos.push(JSON.parse(JSON.stringify(orderInfo)));
    }
    return orderInfos;
  }

  updateShoppingbasket(result){
    let products = result.shoppingbasket;
    let shoppingBasket = this.shoppingbasketProvider.shoppingBasket;
    shoppingBasket.orderedProducts = products;
    shoppingBasket.checkedProducts = [];

    for (let i = 0; i < shoppingBasket.orderedProducts.length; i++) {
      shoppingBasket.checkedProducts.push(true);
      shoppingBasket.orderedProducts[i]['count'] = 1;
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

  searchItem(searchWord, offset = 0) {
    let body : Object;
    let addr : string;
    if(this.isMember == true){
      addr = "member/search.php";
    }else{
      addr = "nonMember/search.php";
    }
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then((val)=>{
        body = { auth: val, searchWord, offset };

        this.http.post(this.serverAddr + addr, body).subscribe(data => {
          console.log(data);

          let result = JSON.parse(data["_body"]);
          if (result.status == "success") {
            console.log(" Success");
            this.storage.set('auth', result.auth);

            if (offset == 0) {
              // 최근 검색 기록 로드
              if (this.isMember == true) {
                if (result.recentSearch != undefined) {
                  this.searchProvider.recentSearchItems = result.recentSearch;
                } else {
                  this.searchProvider.recentSearchItems = [];
                }
              }

              if (result['product'] != undefined) {
                this.searchProducts = result.product;
              } else {
                this.searchProducts = [];
                resolve("noItem");
              }
              resolve("success");
            } else {
              if (result['product'] != undefined) {
                let searchProduct = result.product;
                for (let i = 0; i < searchProduct.length; i++) {
                  this.searchProducts.push(searchProduct[i]);
                }

                if (result.product.length < 20) {
                  resolve("loadEnd");
                } else {
                  resolve("success");
                }
              } else {
                resolve("noItem");
              }
            }
          } else if (result.status == "expired"){
            this.isMember = false;
            this.memberProvider.logout();
            this.storage.remove('auth');
            reject('expired');
          }else{
            console.log("Fail cancelOrder");
            reject("fail");
          }
        }, err => {
          console.log(err);
        });
      });
    });
  }

  undisplayRecentSearchItem(searchID){
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then((val)=>{
        let body = { auth:val, searchID };
        let addr = "search/undisplayRecentSearchItem.php";
        this.http.post(this.serverAddr + addr, body).subscribe(data => {
          console.log(data);
          let result = JSON.parse(data["_body"]);
          if (result.status == "success") {
            console.log(" Success");
            this.storage.set('auth', result.auth);
            // 최근 검색 기록 로드
            if (result.recentSearch != undefined) {
              this.searchProvider.recentSearchItems = result.recentSearch;
            } else {
              this.searchProvider.recentSearchItems = [];
            }
            resolve("success");
          } else if(result.status =='expired'){
            this.isMember = false;
            this.memberProvider.logout();
            this.storage.remove('auth');
            reject('expired');
          } else{
            console.log("Fail cancelOrder");
            reject("fail");
          }
        }, err => {
          console.log(err);
        });
      }); 
    });
  }

  displayNumber(number){
    let temp = number;
    let displayNum = number.toString();
    let i = 0;
    let j = 3;
    while ((temp/1000) > 1){
      i = i + j;
      displayNum = displayNum.substr(0, displayNum.length - i) + ',' + displayNum.substr(-i);
      j = j + 1;
      temp /= 1000;
    }

    return displayNum;
  }

  validateAccessToken(){
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then((val) => {
        let body = { auth: val };
        console.log(val);
        
        this.http.post(this.serverAddr + "auth/auth.php", body).subscribe(data => {
          console.log(data);
          let result = JSON.parse(data["_body"]);
          if (result.status == "success") {
            this.storage.set('auth', result.auth);
            this.isMember = true;
            resolve("success");
          } else if (result.status == 'expired') {
            this.isMember = false;
            this.storage.remove('auth');
            this.memberProvider.logout();
            reject('expired')
          } else {
            this.storage.remove('auth');
            resolve('not exist')
          } 
        }, err => {
          console.log(err);
        });
      });
    });   
  }
}
