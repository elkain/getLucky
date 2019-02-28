import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { MemberProvider } from '../member/member';
import { ShoppingbasketProvider } from '../shoppingbasket/shoppingbasket';

// ip 218.145.181.49 //
/*
  Generated class for the ServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServerProvider {

  serverAddr: string = "http://218.145.181.49/ionic/";

  username: string;
  password: string;

  constructor(public http: Http, private storageProvider: StorageProvider, private memberProvider: MemberProvider, private shoppingbasketProvider:ShoppingbasketProvider) {
    console.log('Hello ServerProvider Provider');
    
  }

  getAllProductData(){
    //상품 정보를 가져옴
    return new Promise((resolve, reject) => {
      this.http.get(this.serverAddr + "product/loadAllProduct.php").subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("product load Success");
          let products = this.productRearrange(result);
          resolve(products);
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
        if (result.status == "success") {
          console.log("product load Success");
          let products = this.productRearrange(result);
          resolve(products);
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

  loadCategory(){
    return new Promise((resolve, reject) => {
      this.http.get(this.serverAddr + "category/loadCategory.php").subscribe(data => {
        console.log(data);
        let result = JSON.parse(data["_body"]);
        if (result.status == "success") {
          console.log("categoryload Success");
          let categoryResult = this.categoryRearrange(result.data);
          resolve(categoryResult);
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
      this.http.post(this.serverAddr + "member/signup.php", memberData).subscribe(data => {
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
      this.http.post(this.serverAddr + "member/checkIDDuplication.php", memberID).subscribe(data => {
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

          this.storageProvider.isMember = true;
          this.memberProvider.memberData.username = memberID;
          this.memberProvider.memberData.password = password;
          this.memberProvider.memberData.birth = result.memberBirth;
          this.memberProvider.memberData.name = result.memberName;
          this.memberProvider.memberData.mobile = result.mobile;
          this.memberProvider.memberData.email = result.email;
          this.memberProvider.memberData.sex = result.memberSex;
          this.memberProvider.memberData.UID = result.memberUID;

          this.memberProvider.deliveryAddrs = result.address;
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
          let products = this.productRearrange(result);
          let shoppingBasket = this.shoppingbasketProvider.shoppingBasket;
          shoppingBasket.orderedProducts = products;
          shoppingBasket.checkedProducts = [];

          for (let i = 0; i < shoppingBasket.orderedProducts.length; i++) {
            shoppingBasket.checkedProducts.push(true);
            shoppingBasket.orderedProducts[i].count = 1;
          }
          shoppingBasket.checkedAllProducts = true;
          
          resolve(shoppingBasket);
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
    let products = [];
    let imagePaths = [];
    let j = 0;
    let path = "./assets/imgs/";
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

    return products;
  }
}
