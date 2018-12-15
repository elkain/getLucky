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
  
  constructor() {
    console.log('Hello MemberProvider Provider');
  }

}
