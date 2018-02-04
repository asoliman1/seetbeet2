import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  loading: boolean;

  notifications=[];
  data: any;
  photoUrl=this.api.photo;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService) {
    this.getnotifications()
  }

  getnotifications(){
    this.loading=true
    
    this.api.get("notifcation?api_token="+localStorage.getItem(this.api.tokenStr)).then(data=>{
      this.data=data;
      this.notifications=this.data
      this.loading=false      
    })
}

  goBack(){
    this.navCtrl.pop()
  }

}
