import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { MessagedetailsPage } from '../messagedetails/messagedetails';



@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  loading: boolean;
  product_id: string;
  messages=[];
  data: any;
  photoUrl=this.api.photo;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService) {
    this.getallmessages();
  this.product_id=localStorage.getItem(this.api.userid);
  
  }

  getallmessages(){
    this.loading=true
    this.api.get("messages?api_token="+localStorage.getItem(this.api.tokenStr)).then(data=>{
      this.data=data;
      this.messages=this.data.data.data
    this.loading=false    
    })
}


gotomessagedetails(product){
  this.navCtrl.push(MessagedetailsPage,product)
}

removemessage(id){
  this.api.post("delete/message/"+id+"?api_token="+localStorage.getItem(this.api.tokenStr),"").then(data=>{
    this.data=data;
    this.api.showToast(this.data.message);
    this.getallmessages();
  })
}
  goBack(){
    this.navCtrl.pop()
  }
  
  doInfinite(infiniteScroll) {
    this.api.get("messages?api_token="+localStorage.getItem(this.api.tokenStr)).then(data=>{
      this.data=data;
      this.messages=this.data.data.data
      infiniteScroll.complete();
      
    })
  }

  doRefresh(refresher) {
    this.getallmessages();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

}
