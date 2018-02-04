import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { ProductslistPage } from '../productslist/productslist';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the StoresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-stores',
  templateUrl: 'stores.html',
})
export class StoresPage {
  loading: boolean;
  stores = [];
  data: any;
  user:boolean=false;
  photoUrl=this.api.photo;
  nextpage_url="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService) {
    this.getallStores()
    this.checkusertype()
  }

  checkusertype(){
    if(localStorage.getItem(this.api.user_type)=="user")
    this.user=true;
  }

  getallStores(){
    this.loading=true
    
    this.api.get("all/store?per_page=5").then(data=>{
      this.data=data;
      this.nextpage_url=this.data.data.next_page_url;
      this.stores=this.data.data.data
      console.log(this.stores)
      this.loading=false
      
    })
}
  goBack(){
    this.navCtrl.pop()
  }

  gotostoreprofile(id){
    this.navCtrl.push(ProfilePage,id)
  }

  subscribe(id){
    this.api.post("subscribe/store/"+id+"?api_token="+localStorage.getItem(this.api.tokenStr),"").then(data=>{
      this.data=data;
      if(this.data.status)
        this.api.showToast(this.data.message)
        else
        this.api.showalert("",this.data.message)
    })
  }

  gotoproducts(id){
    this.navCtrl.push(ProductslistPage,id)
  }
  doInfinite(infiniteScroll) {
  if(this.nextpage_url!=null){
    this.api.get(this.nextpage_url.substring(25)+"&per_page=5").then(data=>{
      this.data=data;
      this.nextpage_url=this.data.data.next_page_url;
      this.data.data.data.forEach(element => {
        this.stores.push(element);
      });
      infiniteScroll.complete();
    })
  } else{
    setTimeout(()=>{ 
    infiniteScroll.complete();
    },500)
    
  }
  
  }

  doRefresh(refresher) {
    this.getallStores();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

}
