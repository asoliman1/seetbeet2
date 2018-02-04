import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';


@Component({
  selector: 'page-rules',
  templateUrl: 'rules.html',
})
export class RulesPage {
data:any;
loading:boolean;
rules = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService) {
    this.getrules()
  }

getrules(){
  this.loading=true;
  this.api.get("page/5").then(data => {
      this.data = data;
      this.rules= this.data.data;
      this.loading=false;
  })
}
goBack(){
  this.navCtrl.pop();
}

}
