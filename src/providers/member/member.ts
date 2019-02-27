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
  findMemberData = { username: "", name: "", email: "", mobile: "", type: "", method: "" };

  constructor() {
    console.log('Hello MemberProvider Provider');
  }

}
