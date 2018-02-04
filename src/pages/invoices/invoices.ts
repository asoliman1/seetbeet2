import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { InvoiceactionPage } from '../invoiceaction/invoiceaction';
import { NewmessagePage } from '../newmessage/newmessage';




@Component({
  selector: 'page-invoices',
  templateUrl: 'invoices.html',
})
export class InvoicesPage {
  nextpage_url="";
  data: any;
  invoices=[];
  photoUrl=this.api.photo;
  loading:boolean;  
  constructor(public navCtrl: NavController, public navParams: NavParams,public api : FirebaseService) {
    this.getinvoices()
  }

  getinvoices(){
    this.loading=true
    let usertype=localStorage.getItem(this.api.user_type);
    if(usertype=="premium"){
      this.api.get("invoices/store?api_token="+localStorage.getItem(this.api.tokenStr)+"&per_page=10").then(data=>{
        this.data=data;
        this.nextpage_url=this.data.data.next_page_url;        
        this.invoices=this.data.data.data;
        this.loading=false;
      })
    }else{
      this.api.get("invoices/user?api_token="+localStorage.getItem(this.api.tokenStr)+"&per_page=10").then(data=>{
          this.data=data;
        this.nextpage_url=this.data.data.next_page_url;                
          this.invoices=this.data.data.data
          this.loading=false;
      })
    }
  }

gotoinvoiceaction(invoice){
  if(localStorage.getItem(this.api.user_type)=="premium")
  this.navCtrl.push(InvoiceactionPage,invoice)
}
  goBack(){
    this.navCtrl.pop()
  }
  gotext(store){
    this.navCtrl.push(NewmessagePage,store)
  }

  doInfinite(infiniteScroll) {
    if(this.nextpage_url!=null){
        this.api.get(this.nextpage_url.substring(25)+"&per_page=5").then(data=>{
          this.data=data;
        this.nextpage_url=this.data.data.next_page_url;
          this.data.data.data.forEach(element => {
            this.invoices.push(element);
          });
        infiniteScroll.complete();      
        })
    }else {
      setTimeout(() => {
        infiniteScroll.complete();
      }, 500);
    }
    
  }

  doRefresh(refresher) {
    this.getinvoices();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  


}
