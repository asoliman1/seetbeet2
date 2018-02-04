import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { StartPage } from '../pages/start/start';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { NotificationsPage } from '../pages/notifications/notifications';
import { InvoicesPage } from '../pages/invoices/invoices';
import { AddproductPage } from '../pages/addproduct/addproduct';
import { MyproductsPage } from '../pages/myproducts/myproducts';
import { SubscribtionsPage } from '../pages/subscribtions/subscribtions';
import { ContactPage } from '../pages/contact/contact';
import { AboutPage } from '../pages/about/about';
import { ProfilePage } from '../pages/profile/profile';
import { FirebaseService } from './firebase-service';
import { MessagesPage } from '../pages/messages/messages';
import { GetlocationPage } from '../pages/getlocation/getlocation';
import { OneSignal } from '@ionic-native/onesignal';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RulesPage } from '../pages/rules/rules';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage: any = StartPage;
  @ViewChild(Nav) nav: Nav;
  usertype = "";
  profile_photo = "";
  profile_name = "";
  invoice_alert: any;
  message_alert: any;
  expire_date: any;
  expire_account: any;
  photoUrl = this.api.photo;
  user: boolean;
  notuser: boolean;
  premium: boolean;
  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public api: FirebaseService, public events: Events, public oneSignal: OneSignal, private iab: InAppBrowser,public menuCtrl: MenuController,public net:Network) {
    this.checkuser()
    this.setuserstype();
    if (!this.notuser) {
      this.getexpire();
      this.getalerts("invoice");
      this.getalerts("message");
    }
    events.subscribe('user:created', (user, time) => {
      this.usertype = localStorage.getItem(this.api.user_type)
      this.profile_photo = localStorage.getItem(this.api.photourl);
      this.profile_name = localStorage.getItem('name')
      let expire: any = localStorage.getItem('expire_date')
      expire = expire * 1;
      this.expire_date = new Date(expire * 1000).toLocaleDateString();
      this.setuserstype();
      if (!this.notuser) {
        this.getexpire();
        this.getalerts("invoice");
        this.getalerts("message");

      }
    });
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.shownotifications()
      this.checknetwork();
    });
  }

  shownotifications() {
    this.oneSignal.startInit("cca7c0a1-4186-4dfd-8b0c-bc185238ec08");

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      this.nav.push(NotificationsPage);
    });

    this.oneSignal.endInit();
  }

  checknetwork(){
    this.net.onDisconnect().subscribe((data)=>{
      alert("برجاء تشغيل الأنترنت")
      this.platform.exitApp();
    })
  }

  checkuser() {
    if (localStorage.getItem(this.api.tokenStr)) {
      this.rootPage = TabsPage;
      console.log(localStorage.getItem("token"))
      this.profile_photo = localStorage.getItem(this.api.photourl);
      this.profile_name = localStorage.getItem('name');
      let expire: any = localStorage.getItem('expire_date')
      expire = expire * 1;
      this.expire_date = new Date(expire * 1000).toLocaleDateString();
    }
    this.usertype = localStorage.getItem(this.api.user_type);
    this.setuserstype()
    console.log(this.usertype);
  }

  setuserstype() {
    if (this.usertype == "admin" || this.usertype == "user") {
      this.user = true;
      this.notuser = false;
      this.premium = false;
    }
    else if (this.usertype == "premium") {
      this.premium = true;
      this.user = false;
      this.notuser = false;
    }
    else {
      this.notuser = true;
      this.user = false;
      this.premium = false;
    }
  }

  getexpire() {
    setInterval(() => {
      this.api.get("expire/account?api_token=" + localStorage.getItem('token')).then(data => {
        this.expire_account = data;
        this.expire_account = this.expire_account.end_account;
        if (!this.expire_account) {
          this.api.signOut();
          this.nav.setRoot(StartPage);
          this.api.showalert("", "لقد تم انتهاء اشتراكك برجاء تجديد الأشتراك");
          this.expire_account=null;
        }
      })
    }, 3600000)
  }

  itemSelected(id) {
    switch (id) {
      case 1:
        this.nav.push(TabsPage)
        break;
      case 2:
        this.nav.push(EditprofilePage)
        break;
      case 3:
        this.nav.push(NotificationsPage)
        break;
      case 4:
        this.nav.push(InvoicesPage)
        break;
      case 5:
        this.nav.push(MyproductsPage)
        break;
      case 6:
        this.nav.push(AddproductPage)
        break;
      case 7:
        this.nav.push(SubscribtionsPage)
        break;
      case 8:
        this.nav.push(ContactPage)
        break;
      case 9:
        this.nav.push(AboutPage)
        break;
      case 10:
        this.nav.setRoot(StartPage)
        this.api.signOut();
        break;
      case 11:
        this.nav.push(MessagesPage)
        break;
      case 12:
        this.nav.push(GetlocationPage)
        break;
      case 13:
        this.iab.create("http://s-baet.com/cp/api/renewal?api_token=" + localStorage.getItem('token'));
        break;
        case 14:
        this.nav.push(RulesPage)
        break;
    }
  }

  getalerts(type) {
      setInterval(()=>{
    if(localStorage.getItem('token')!=null){
        this.api.get("count/unseen/" + type + "?api_token=" + localStorage.getItem('token')).then(data => {
          if (type == "message") {
            this.message_alert = data;
            this.message_alert = this.message_alert.data;
          }
          else {
            this.invoice_alert = data;
            this.invoice_alert = this.invoice_alert.data;
          }
        })
      }
      },10000)
    
  
  }

  gotoprofile() {

    this.nav.push(ProfilePage, "myprofile")
  }

}
