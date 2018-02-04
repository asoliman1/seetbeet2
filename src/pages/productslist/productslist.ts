import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { ProductdetailsPage } from '../productdetails/productdetails';

/**
 * Generated class for the ProductslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-productslist',
  templateUrl: 'productslist.html',
})
export class ProductslistPage {
  nextpage_url="";
  loading: boolean;
  products = [];
  data: any;
  photoUrl=this.api.photo;
  product_id=this.navParams.data
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService) {
    this.getallproducts()
  }

  getallproducts(){
    this.loading=true    
    this.api.get("product/store/"+this.product_id+"?per_page=10").then(data=>{
      this.data=data;
      this.nextpage_url=this.data.data.next_page_url
      this.products=this.data.data.data
      this.loading=false      
    })
}

gotoproductdetail(product){
  this.navCtrl.push(ProductdetailsPage,product)
}
doInfinite(infiniteScroll) {
  if(this.nextpage_url!=null){
      this.api.get(this.nextpage_url.substring(25)+"&per_page=5").then(data=>{
        this.data=data;
      this.nextpage_url=this.data.data.next_page_url;
        this.data.data.data.forEach(element => {
          this.products.push(element);
        });
      infiniteScroll.complete();      
      })
  }else {
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }
  
}

doRefresh(refresher) {
  this.getallproducts();
  setTimeout(() => {
    refresher.complete();
  }, 1000);
}


  goBack(){
    this.navCtrl.pop()
  }

}
