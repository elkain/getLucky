//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
/*
  Generated class for the MemberProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MemberProvider {

  memberData = { UID:"", username: "", password: "", name: "", email: "", mobile: "", address: "", birth: "", sex: "" };
  deliveryAddrs = [];
  isMember=false;

  constructor() {
    
    this.deliveryAddrs = [
      { type: "기본주소", address: "서울시 강동구 고덕로 131 (암사동, 강동롯데캐슬퍼스트아파트) 123동 1234호", receiver: "이충민", mobile: "010-1234-5678" },
      { type: "사무실", address: "서울시 강동구 성암로 11길 24 3층", receiver: "이충민", mobile: "010-1234-5678" },
      { type: "매장", address: "서울시 강동구 상암로 18길 암사럭키슈퍼", receiver: "이충민", mobile: "02-441-3545" }
    ];

    console.log('Hello MemberProvider Provider');
  }

}
