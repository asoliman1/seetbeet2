import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { ProductslistPage } from '../productslist/productslist';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: boolean = false;
  stores = [];
  data: any;
  photoUrl = this.api.photo;
  loading: boolean;
  constructor(public navCtrl: NavController, public api: FirebaseService) {
    this.getTopStores()
    this.checkusertype();

  }
  goBack() {
    this.navCtrl.pop()
  }

  getTopStores() {
    this.loading = true
    this.api.get("top/store").then(data => {
      this.data = data;
      this.stores = this.data.data
      this.loading = false;
      console.log(this.stores)
    })
  }

  gotostoreprofile(id) {
    this.navCtrl.push(ProfilePage, id)
  }

  checkusertype() {
    if (localStorage.getItem(this.api.user_type) == "user")
      this.user = true;
  }

  subscribe(id) {
    this.api.post("subscribe/store/" + id + "?api_token=" + localStorage.getItem(this.api.tokenStr), "").then(data => {
      this.data = data;
      if (this.data.status)
        this.api.showToast(this.data.message)
      else {
        this.api.showalert("", this.data.message)
      }
    })
  }

  gotoproducts(id) {
    this.navCtrl.push(ProductslistPage, id)
  }
  doRefresh(refresher) {
    this.getTopStores();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

}
