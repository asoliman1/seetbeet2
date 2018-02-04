import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { LoadingController } from "ionic-angular";
import { ToastController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';


@Injectable()
export class FirebaseService {
    apiA = "http://s-baet.com/cp/api/";
    photo = "http://s-baet.com/cp/upload/"
    obj: object = {};
    orders = [];
    
    constructor(public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: Http, public alertCtrl: AlertController) {
    }
    public profile: any;
    tokenStr = "token";
    user_type= "type";
    userid="id";
    photourl="photo";
    name="name";
    expire_date="expire_date";
    
    saveAccessToken(access_token,usertype) {
        localStorage.setItem(this.tokenStr, access_token);
        localStorage.setItem(this.user_type,usertype)
    }

    setnotuser(){
        localStorage.setItem(this.user_type,"notuser")        
    }

    saveuserid(userid,photourl,name,expire_date){
        localStorage.setItem(this.userid,userid)
        localStorage.setItem(this.photourl,photourl)
        localStorage.setItem(this.name,name)
        localStorage.setItem(this.expire_date,expire_date)
    }

    signOut() {
        localStorage.removeItem(this.tokenStr);
        localStorage.removeItem(this.user_type);
        localStorage.removeItem(this.userid)
        localStorage.removeItem(this.photourl)
        localStorage.removeItem(this.name);
        
    }

    getApiLink() : String{
        return this.apiA;
    }
   
    get(url) {
        return new Promise(resolve => {
            this.http.get(this.apiA + url).map(res => res.json())
                .subscribe(success => {
                    this.obj = success
                    console.log(success)
                    resolve(this.obj);
                }, error => {
                    resolve(error);
                    console.log(error)
                   
                }, () => {
                });
        });
    }

    post(url, data) {
        return new Promise(resolve => {
            this.http.post(this.apiA + url, data).map(res => res.json())
                .subscribe(success => {
                    resolve(success);
                    console.log(success)                    
                }, error => {
                    resolve(error);
                    console.log(error)
                   
                }, () => {
                });
        });
    }



    showToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
        });
        toast.present();
    }



    showalert(title, msg) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: ['تم'],
             cssClass: 'alert'
        });
        alert.present();
    }

    applyHaversine(locations, user) {

            for(let i=locations.length-1;i>-1;i--){ 
            let placeLocation = {
                lat: locations[i].location_rest_latitude,
                lng: locations[i].location_rest_longitude
            };
            console.log(placeLocation)
            console.log(locations[i])
            locations[i].distance = this.getDistanceBetweenPoints(
                user,
                placeLocation,
                'km'
            ).toFixed(2);

           if(parseInt(locations[i].distance)>2.1){
               locations.splice(i,1)
           }
                
            }
//sorting array by distances
            locations.sort(function(a, b){return a.distance - b.distance});
        return locations;
    }

    getDistanceBetweenPoints(start, end, units) {

        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        let R = earthRadius[units || 'miles'];
        let lat1 = start.lat;
        let lon1 = start.lng;
        let lat2 = end.lat;
        let lon2 = end.lng;

        let dLat = this.toRad((lat2 - lat1));
        let dLon = this.toRad((lon2 - lon1));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        return d;

    }

    toRad(x) {
        return x * Math.PI / 180;
    }

}
