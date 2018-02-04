import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
  upload_loading: boolean;
  data: any;
totime="";
fromtime="";
profile={
  name:'',
  level:'',
  mobile:'',
  other_mobile:'',
  facebook:'',
  whatsapp:'',
  phone:'',
  email:'',
  delivery:'',
  worktime_from:'',
  worktime_to:'',
  address:'',
  password:'',
  instagram:'',
  area:'',
  city:'',
  logo:''
};
disable={
  name:true,
  email:true,
  mobile:true,
  other_mobile:true,
  phone:true,
  instagram:true,
  facebook:true,
  delivery:true,
  worktime_from:true,
  worktime_to:true,
  address:true,
  whatsapp:true,
  city:true,
  area:true
}
  photoUrl=this.api.photo
  user_type = ""
  premium : boolean;
  areas=[];
  cities=[];
  loading:boolean=false;
  new_image:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService,private transfer: FileTransfer, private file: File,private imagePicker: ImagePicker,public phviewer:PhotoViewer) {
    this.getprofile()
    this.checkprofiletype()
    this.getareas()
  } 
  
  getprofile(){
    this.loading=true
    this.api.get("user?api_token="+localStorage.getItem(this.api.tokenStr)).then(data=>{
      this.data=data;
      this.profile=this.data;
      this.loading=false
    })
  }
  checkprofiletype(){
    this.user_type=localStorage.getItem(this.api.user_type);
    if(this.user_type=="premium"){
      this.premium=true;
    }
    
  }
  getareas(){
    this.api.get("area/city").then(data=>{
      this.data=data;
      this.areas=this.data.data;
    })
  }

  getcities(id){
    this.areas.forEach(element=>{
      if(element.id==id){
        this.cities=element.city;
        console.log(this.cities)
      }
    })
  }
  
  updateprofile(){

  if(this.profile.level=="premium")
    this.profile.level="store";

    let url ="update/account?api_token=" + localStorage.getItem(this.api.tokenStr)
    + "&type_account=" + this.profile.level
    + "&name=" + this.profile.name
      + "&mobile=" + this.profile.mobile
      + "&password=" + this.profile.password
      + "&delivery=" + this.profile.delivery
      + "&phone=" + this.profile.phone
      + "&area_id=" + this.profile.area
      + "&city_id=" + this.profile.city      
      + "&facebook=" + this.profile.facebook
      + "&whatsapp=" + this.profile.whatsapp
      + "&instagram=" + this.profile.instagram
      + "&worktime_from=" + this.profile.worktime_from+this.totime
      + "&worktime_to=" + this.profile.worktime_to+this.fromtime
      + "&address=" + this.profile.address
      + "&other_mobile=" + this.profile.other_mobile
    this.api.post(url,this.profile).then(data=>{
      this.data=data;
      if(this.data.status){ 
        this.getprofile();
        this.api.showToast("تم تعديل الحساب")
      }
        else{
          this.api.showalert("",this.data.message)
        }
    })
  }

  openfullscreen(photo){
    this.phviewer.show(photo)
  }

  updatepic(){
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'seetbeet.jpg',
      mimeType: "multipart/form-data",
      chunkedMode:false,
   }

   let options1 : ImagePickerOptions = {
    quality : 60,
    maximumImagesCount:1
   }
   this.imagePicker.getPictures(options1).then((picture) => {
     this.upload_loading=true;
     this.new_image=picture[0];
    fileTransfer.upload(picture[0],this.api.apiA+"upload?api_token="+localStorage.getItem('token')+"&type=user",options,true).then((data)=>{
      this.upload_loading=false;
      this.getprofile();
      this.new_image="";
    })
  }, (err) => {
    console.log(err)
   });


  }

  goBack(){
    this.navCtrl.pop()
  }

}
