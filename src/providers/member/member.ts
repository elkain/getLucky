import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the MemberProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MemberProvider {

  memberData = { username: "", password: "", name: "", email: "", mobile: "", address: "", birth: "", sex: "" };
  deliveryAddrs = [];

  constructor() {
    this.memberData = { username: "hee2358", password: "rhkrthdus1", name: "이철", email: "hee2358@naver.com", mobile: "010-5269-8621", address: "서울시 강동구 명일동 현대아파트", birth: "1986-12-13", sex: "male" };
    this.deliveryAddrs = [
      { title: "기본배송지", address: "서울시 강동구 고덕로 131(암사동, 강동롯데캐슬퍼스트) 123동 1234호" },
      { title: "사무실", address: "서울시 상암로 11길 24 3층" },
      { title: "매장", address: "서울시 상암로 11길 18 암사럭키슈퍼" },
    ];

    console.log('Hello MemberProvider Provider');
  }

}
