import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ViewController, LoadingController, Platform } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { Geolocation,GeolocationOptions } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';



@Component({
  selector: 'page-getlocation',
  templateUrl: 'getlocation.html',
})
export class GetlocationPage {

  @ViewChild('map')
  mapElement: ElementRef;
  map: any;
  marker: any;
  loading:boolean;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  coords: any;
  data: any;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public geolocation: Geolocation, public api: FirebaseService, public loadingCtrl: LoadingController, public platform: Platform, public dg: Diagnostic) {
    this.getlocation()
  }


  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: { lat: this.coords.latitude, lng: this.coords.longitude }
    });
    this.marker = new google.maps.Marker({
      position: { lat: this.coords.latitude, lng: this.coords.longitude },
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });
    this.directionsDisplay.setMap(this.map);
  }



  getlocation() {
    this.loading=true;
 let options : GeolocationOptions = {
      timeout : 10000
    }
      this.geolocation.getCurrentPosition(options).then((resp) => {
        this.coords = resp.coords;
        this.loading=false;
        console.log(this.coords)
        this.initMap();

      }).catch((error) => {
        this.loading=false;
        alert("برجاء التاكد من تشغيل الجي بي اس")
        if(this.platform.is('android'))
        {
          this.platform.exitApp();
        this.dg.switchToLocationSettings();
        
        }
      })
  }

  savelocation() {
    let loading = this.loadingCtrl.create({
      content: 'انتظر',
    });
    loading.present().then(() => {

      if (this.coords.latitude != null && this.coords.longitude !== null) {
        let url = "update/latlng?api_token=" + localStorage.getItem(this.api.tokenStr)
          + "&lat=" + this.coords.latitude
          + "&lng=" + this.coords.longitude
        this.api.post(url, location).then(data => {
          this.data = data;
          this.api.showalert("", this.data.message)
          loading.dismiss();
          this.dismiss()
        })

      }
    })

  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
 

}
