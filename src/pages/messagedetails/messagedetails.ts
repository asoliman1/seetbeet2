import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';

/**
 * Generated class for the MessagedetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-messagedetails',
  templateUrl: 'messagedetails.html',
})
export class MessagedetailsPage {
  myid: string;
  loading: boolean;
  message: any;
data:any;
replays=[];
text=""
  constructor(public navCtrl: NavController, public navParams: NavParams,public api: FirebaseService) {
    this.message=this.navParams.data;
    this.getmessage();
    this.myid=localStorage.getItem(this.api.userid);
  }

  getmessage(){
    this.loading=true
    this.api.get("message/"+this.message.id+"?api_token="+localStorage.getItem(this.api.tokenStr)).then(data=>{
      this.data=data;
      this.replays=this.data.data.replay.data;
      this.loading=false;
    })
}

addreplay(){
  if(this.text!=null)
  this.api.post("replay/message/"+this.message.id+"?api_token="+localStorage.getItem(this.api.tokenStr)+ "&message=" + this.text ,"").then(data=>{
    this.data=data;
    if(this.data.status){ 
      this.api.showToast(this.data.message)
      this.api.get("message/"+this.message.id+"?api_token="+localStorage.getItem(this.api.tokenStr)).then(data=>{
        this.data=data;
        this.replays=this.data.data.replay.data;
      })
    }
    else
    this.api.showalert("",this.data.message)
    this.getmessage();
    this.text="";
  })
}

removereplay(id){
  this.api.post("delete/replay/message/"+id+"?api_token="+localStorage.getItem(this.api.tokenStr),"").then(data=>{
    this.data=data;
    if(this.data.status){ 
    this.api.get("message/"+this.message.id+"?api_token="+localStorage.getItem(this.api.tokenStr)).then(data=>{
      this.data=data;
      this.replays=this.data.data.replay.data;
    })
  }
  })
}
  goBack(){
    this.navCtrl.pop()
  }

  doInfinite(infiniteScroll) {
    this.api.get("message/"+this.message.id+"?api_token="+localStorage.getItem(this.api.tokenStr)).then(data=>{
      this.data=data;
      this.replays=this.data.data.replay.data;
      infiniteScroll.complete();
      
    })
  }


}
