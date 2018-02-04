import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductslistPage } from '../productslist/productslist';
import { FirebaseService } from '../../app/firebase-service';

/**
 * Generated class for the SubscribtionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-subscribtions',
  templateUrl: 'subscribtions.html',
})
export class SubscribtionsPage {
  loading: boolean;

  stores=[];
  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService) {
    this.getallStores()
  }

  getallStores(){
    this.loading=true
    
    this.api.get("all/subscribtion?api_token="+localStorage.getItem(this.api.tokenStr)).then(data=>{
      this.data=data;
      this.stores=this.data.data.data
      this.loading=false      
    })
}
  goBack(){
    this.navCtrl.pop()
  }

  removesubs(id){
    this.api.post("remove/subscribe/store/"+id+"?api_token="+localStorage.getItem(this.api.tokenStr),"").then(data=>{
      this.data=data;
    })
  }

  doRefresh(refresher) {
    this.getallStores();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  gotoproducts(id){
    this.navCtrl.push(ProductslistPage,id)
  }
}
