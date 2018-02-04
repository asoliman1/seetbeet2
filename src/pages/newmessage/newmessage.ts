import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';


@Component({
  selector: 'page-newmessage',
  templateUrl: 'newmessage.html',
})
export class NewmessagePage {
  loading: boolean=false;
  message = {
  title:'',
  content:'',
  id:this.navParams.data.id
}
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService) {
  }


  sendmessage(){
    this.loading=true;
    this.api.post("new/message?api_token="+localStorage.getItem(this.api.tokenStr) + "&title=" + this.message.title
    + "&message=" + this.message.content
    + "&to_user=" + this.message.id,this.message).then(data=>{
      this.loading=false;
      this.api.showToast("تم ارسال الرساله للمتجر")
    })
  }

 goBack(){
   this.navCtrl.pop();
 }

}
