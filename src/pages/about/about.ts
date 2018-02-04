import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  data:any;
  about = {}
  constructor(public navCtrl: NavController,public api:FirebaseService) {
    this.getabout()
  }

  getabout(){
    this.api.get("page/1").then(data=>{
      this.data=data;
      this.about = this.data.data;
    })
  }

  goBack(){
    this.navCtrl.pop()
  }
}
