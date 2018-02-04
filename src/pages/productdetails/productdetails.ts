import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { NewmessagePage } from '../newmessage/newmessage';
import { PhotoViewer } from '@ionic-native/photo-viewer';


@Component({
  selector: 'page-productdetails',
  templateUrl: 'productdetails.html',
})
export class ProductdetailsPage {
  notuser: boolean=false;
  purchase_comment: string;
  loading: boolean;
  productdetails = this.navParams.data;
  comments=[];
  data:any;
  photoUrl=this.api.photo;
  comment="";
  Date= new Date();
  user:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api : FirebaseService,public alertCtrl: AlertController,public phviewer:PhotoViewer) {
    this.getcomments()
    console.log(this.productdetails)
    this.checkusertype()
  }
  gofullscreen(photo){
    photo=this.photoUrl+photo;
    this.phviewer.show(photo)
  }
  getcomments(){
    this.loading=true
    this.api.get("product/"+this.productdetails.id).then(data=>{
      this.data=data;
      this.comments=this.data.data.comments
    this.loading=false
    
      console.log(this.comments)
    })
  }

  checkusertype(){
    if(localStorage.getItem(this.api.user_type)=="user")
      this.user=true;
      else if(localStorage.getItem(this.api.user_type)=="notuser")
      this.notuser=true;
  }

  gotext(){
    let store = this.productdetails.user_id
    this.navCtrl.push(NewmessagePage,store)
  }

  addcomment(){
    let id = this.productdetails.id
    this.api.post("add/comment?api_token="+localStorage.getItem(this.api.tokenStr) + "&product_id=" + id
    + "&comment=" + this.comment,"").then(data=>{
      this.data=data
      this.getcomments()
      this.comment=""
    })
  }

  removecomment(id){
    this.api.post("remove/comment?api_token="+localStorage.getItem(this.api.tokenStr) + "&id=" + id,"").then(data=>{
      this.data=data
      this.api.showToast(this.data.message);
      this.getcomments()
    })
      }

      purchaseproduct(){
        if(this.user){ 
        let prompt = this.alertCtrl.create({
          title: 'شراء المنتج',
          message: "ملاحظات عند شراء المنتج",
          inputs: [
            {
              name: 'notes',
              placeholder: 'اكتب ملاحظاتك للتاجر'
            },
          ],
          buttons: [
            {
              text: 'الغاء',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'شراء',
              handler: data => {
                if(data.notes=="")
                    data.notes="لا يوجد ملاحظات";
                let current_date= this.Date.toLocaleDateString();
                let current_time= this.Date.toLocaleTimeString();
                let url = "invoices/new?api_token=" + localStorage.getItem(this.api.tokenStr)
                + "&store_id=" + this.productdetails.user_id.id
                + "&comment=" +   data.notes 
                + "&date_receipt=" + current_date
                + "&time_receipt=" + current_time
                + "&post_id=" + this.productdetails.id
                this.api.post(url,"").then(data=>{
                  this.data=data;
                  if(this.data.status){
                    this.api.showToast("تم طلب المنتج بنجاح و سوف يتم الرد عليكم من قبل التاجر")
                  }else{
                    this.api.showalert("",this.data.messages)
                  }
                })
              }
            }
          ]
        });
        prompt.present();}
        else if(this.notuser){
          this.api.showalert("انت لست عضو","برجاء التسجيل حتي تستطيع شراء المنتج")
        }
        else{
          this.api.showalert("","برجاء التسجيل كعضو حتي تتمكن من شراء المنتج")
        }
      }
  
  goBack(){
    this.navCtrl.pop()
  }

}
