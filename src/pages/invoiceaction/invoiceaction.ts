import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';


@Component({
  selector: 'page-invoiceaction',
  templateUrl: 'invoiceaction.html',
})
export class InvoiceactionPage {
id=this.navParams.data.id
status="";
data:any;
loading:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService) {
  }

  addinvoiceaction(){
    this.loading=true;
    let url = "invoices/store/action?api_token=" + localStorage.getItem(this.api.tokenStr) + "&id=" + this.id
    + "&status=" + this.status
    console.log(url)
    this.api.post(url,"").then(data=>{
      this.data=data;
    this.loading=false;
    this.api.showToast(this.data.message)  
    this.goBack();  
    })
  }

 goBack(){
   this.navCtrl.pop()
 }
}
