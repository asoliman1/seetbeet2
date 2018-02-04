import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { ProductdetailsPage } from '../productdetails/productdetails';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the OffersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {
  loading: boolean;
  photoUrl= this.api.photo;
  offers=[];
  data: any;
  nextpage_url="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService) {
    this.getalloffers()
  }

  getalloffers(){
    this.loading=true
    
    this.api.get("all/offers?per_page=10").then(data=>{
      this.data=data;
      this.nextpage_url=this.data.data.next_page_url;
      this.offers=this.data.data.data
      this.loading=false      
    })
}

gotoproductdetails(product){
  this.navCtrl.push(ProductdetailsPage,product)
}

doInfinite(infiniteScroll) {
  if(this.nextpage_url!=null){
      this.api.get(this.nextpage_url.substring(25)+"&per_page=5").then(data=>{
        this.data=data;
      this.nextpage_url=this.data.data.next_page_url;
        this.data.data.data.forEach(element => {
          this.offers.push(element);
        });
      infiniteScroll.complete();      
      })
  }else {
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }
  
}
gotostoreprofile(id){
  this.navCtrl.push(ProfilePage,id)
}

doRefresh(refresher) {
  this.getalloffers();
  setTimeout(() => {
    refresher.complete();
  }, 1000);
}

  goBack(){
    this.navCtrl.pop()
  }

}
