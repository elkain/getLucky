//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
/*
  Generated class for the MemberProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MemberProvider {
  
  nonMemberOrderInfo = {};
  memberData = { UID:"", username: "", password: "", name: "", email: "", mobile: "", address: "", birth: "", sex: "" };
  deliveryAddrs = [];
  findMemberData = { username: "", name: "", email: "", mobile: "", type: "", method: "" };
  memberOrderInfo = {};

  constructor(private storage: Storage,) {
    console.log('Hello MemberProvider Provider');
    
  }

  logout(){
    this.memberData = { UID: "", username: "", password: "", name: "", email: "", mobile: "", address: "", birth: "", sex: "" };
    this.deliveryAddrs = [];
    this.memberOrderInfo = {};
    this.storage.remove('auth');
  }
}
