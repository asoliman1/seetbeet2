import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { FirebaseService } from '../../app/firebase-service';


@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService,public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }
  goBack(){
    this.navCtrl.pop()
  }

  goto(id){
    switch(id){
      case 1:
      this.navCtrl.push(LoginPage)
      break;
      case 2:
      this.navCtrl.push(SignupPage)
      break;
      case 3:
      this.navCtrl.push(TabsPage)
      this.api.setnotuser();      
      this.events.publish('user:created', "notuser", Date.now());
      break;
    }
  }

}
