import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';

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

  constructor(public http: Http, private platform: Platform, private storageProvider: StorageProvider) {
    console.log('Hello ServerProvider Provider');
  }

  getProductData(){
    //상품 정보를 가져옴
    
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
    })    
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
    })    
  }

  modify(memberData){
    return new Promise((resolve, reject) => {
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
    })    
  }

}
