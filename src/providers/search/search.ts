import { Injectable } from '@angular/core';

/*
  Generated class for the SearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchProvider {

  recentSearchItems = new Array();
  popularSearchItems = new Array();


  constructor() {
    this.popularSearchItems = ["가", "나", "다"];
    console.log('Hello SearchProvider Provider');
  }

}
