import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';


@Component({
  selector: 'page-myproducts',
  templateUrl: 'myproducts.html',
})
export class MyproductsPage {
  nextpage_url="";
  loading: boolean;
  products=[];
  data: any;
  photoUrl=this.api.photo;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService) {
    this.getallproducts()
  
  }

  getallproducts(){
        this.loading=true
    this.api.get("product/store/"+localStorage.getItem(this.api.userid)+"?per_page=10").then(data=>{
      this.data=data;
      this.nextpage_url=this.data.data.next_page_url;      
      this.products=this.data.data.data
      this.loading=false      
    })
}

removeproduct(id){
  this.api.post("delete/product?api_token="+localStorage.getItem(this.api.tokenStr)+"&id="+id,"").then(data=>{
    this.data=data;
    this.api.get("product/store/"+localStorage.getItem(this.api.userid)+"&per_page=10").then(data=>{
      this.data=data;
      this.nextpage_url=this.data.data.next_page_url;      
      this.products=this.data.data.data
    })
  })
}

  goBack(){
    this.navCtrl.pop()
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

}
