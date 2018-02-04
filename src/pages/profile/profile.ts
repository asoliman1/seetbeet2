import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { PhotoViewer } from '@ionic-native/photo-viewer';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild('map')
  mapElement: ElementRef;
  map: any;
  marker: any;
  loading:boolean;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  myprofile: boolean = false;
  data: any;
  profile={}
  photoUrl=this.api.photo
  user_type = "";
  store_id ="";
  premium : boolean;
  rate:any;
  profile_expire="";
  store_rate:any;
  lat:any;
  lng:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:FirebaseService,public phviewer:PhotoViewer) {
   this.store_id=this.navParams.data;
    if(this.store_id=="myprofile"){ 
      this.myprofile=true;
    this.getprofile()
    this.checkprofiletype()
    if(this.premium)
    this.getexpire()
    
  }
      else{
        this.getstoreprofile()
      }
  } 
  getprofile(){
    this.loading=true
    
    this.api.get("user?api_token="+localStorage.getItem(this.api.tokenStr)).then(data=>{
      this.data=data;
      this.profile=this.data;
      if(this.data.level=="premium"){
        this.getrate(this.data.id)
      }
      this.initMap();
      this.loading=false
      
    })
  }

  getexpire(){
    this.api.get("expire/account?api_token="+localStorage.getItem('token')).then(data=>{
      this.data=data;
      this.profile_expire=this.data.data.expire_to;
        })
  }


  initMap() {
    this.lat=this.profile;
    this.lat=this.lat.lat*1;
    this.lng=this.profile;
    this.lng=this.lng.lng*1;
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: { lat: this.lat, lng: this.lng }
    });
    this.marker = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });
    this.directionsDisplay.setMap(this.map);
  }

  checkprofiletype(){
    this.user_type=localStorage.getItem(this.api.user_type);
    if(this.user_type=="premium"){
      this.premium=true;
    }
    
  }

  addrate(id){
    this.api.post("rate/store/"+id+"?api_token="+localStorage.getItem(this.api.tokenStr)+"&vote="+this.rate,"").then(data=>{
     this.data=data
      if(this.data.status)
        this.api.showToast(this.data.message)
        else
        this.api.showalert("",this.data.message)
    })
  }

  getrate(id){
    this.api.get("store/"+id).then(data=>{
      this.data=data;
      this.data=this.data.data
if(this.data.rate_5==1)
      this.store_rate=5;
      else if(this.data.rate_4==1)
      this.store_rate=4;
      else if(this.data.rate_3==1)
      this.store_rate=3;
      else if(this.data.rate_2==1)
      this.store_rate=2;
      else
      this.store_rate=1;

      console.log(this.store_rate)
    })
  }

  getstoreprofile(){
    this.api.get("get/user/"+this.store_id).then(data=>{
      this.data=data;
      if(this.data.data.level=="premium")
        this.premium=true;
      this.profile=this.data.data;
      this.initMap();
    })
  }

  gotofullscreen(photo){
    photo=this.photoUrl+photo;
    this.phviewer.show(photo)
  }

  goBack(){
    this.navCtrl.pop()
  }


}
