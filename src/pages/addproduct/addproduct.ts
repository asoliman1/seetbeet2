import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { File } from '@ionic-native/file';
import { FileUploadOptions, FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';


@Component({
  selector: 'page-addproduct',
  templateUrl: 'addproduct.html',
})
export class AddproductPage {
productObj = {
  title:'',
  price:'',
  areaid:'',
  cityid:'',
  dep:'',
  post_type:'',
  subdep:'',
  content:''
}
picture=[];
pictures=[];
areas=[];
cities=[];
deps=[];
subdeps=[];
data:any
image_loading:boolean;
images_loading:boolean;
addproduct_loading:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api : FirebaseService,public imagePicker:ImagePicker,public transfer: FileTransfer, public file: File) {
    this.getareas()    
    this.getdeps()
  }

  addpic(id){
console.log(id);
    let options1 : ImagePickerOptions = {
    quality : 80,
    maximumImagesCount:id
   }
   this.imagePicker.getPictures(options1).then((pictures) => {
    if(id==1)
    this.picture=pictures;
    else if(id==5)
    this.pictures=pictures;
  }, (err) => {
    console.log(err)
   });

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

  getdeps(){
    this.api.get("department").then(data=>{
      this.data=data;
      this.deps=this.data.data;
    })
  }

  getsubdeps(){
    this.deps.forEach(element=>{
      if(element.id==this.productObj.dep){
        this.subdeps=element.parent;
        console.log(this.subdeps)
      }
    })
  }

  addproduct(){
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'seetbeet.jpg',
      mimeType: "multipart/form-data",
      chunkedMode:false,
   }
   let url1="";
   let url2="";
    let url = "add/product?api_token=" + localStorage.getItem('token')
    + "&title=" + this.productObj.title
    + "&price=" + this.productObj.price
    + "&area_id=" + this.productObj.cityid
    + "&city_id=" + this.productObj.areaid
    + "&department_id=" + this.productObj.dep
    + "&sub_dep=" + this.productObj.subdep
    + "&content=" + this.productObj.content
    + "&post_type=offer"
console.log(url)
this.addproduct_loading=true;
    this.api.post(url,"").then(data=>{
      this.data=data;
      if(this.data.status){
        this.api.showToast(this.data.message)
        if(this.pictures||this.picture)
        this.api.showToast("جاري رفع الصور");      
        if(this.picture.length!=0){
          this.image_loading=true;
          url1=this.api.apiA+"upload?api_token="+localStorage.getItem('token')+"&type=product&product_id="+this.data.data.id;
          this.picture.forEach(picture => {
            fileTransfer.upload(picture,url1,options,true).then((data)=>{
              this.image_loading=false;
              this.addproduct_loading=false;
              this.api.showToast("تم رفع الصوره الرئيسيه");
              if(this.pictures.length==0)
                  this.goBack();
        
              })
          });
         }
         if(this.pictures.length!=0){
           this.images_loading=true;
           this.addproduct_loading=true;
          url2=this.api.apiA+"upload?api_token="+localStorage.getItem('token')+"&type=single_photo&product_id="+this.data.data.id;
          this.pictures.forEach(picture => {
            fileTransfer.upload(picture,url2,options,true).then((data)=>{
             this.images_loading=false;
             this.addproduct_loading=false;
             this.api.showToast("تم رفع الصور الاضافيه");
              this.goBack();
              })
          });
        }
      }
      else{
        this.api.showalert("",this.data.message)
      }
    })
  }
 
  goBack(){
    this.navCtrl.pop()
  }

}
