import { Component } from '@angular/core';
import { NavController, LoadingController, Events } from 'ionic-angular';
import { FirebaseService } from '../../app/firebase-service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User } from '../../models/user';
import { TabsPage } from '../tabs/tabs';
import { ActivationPage } from '../activation/activation';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  expire_account: any;
  loginForm: FormGroup;
  user = {} as User
  data :any;
  constructor(public navCtrl: NavController, public api: FirebaseService, private formBuilder: FormBuilder, public loadingCtrl: LoadingController,public events: Events,private iab: InAppBrowser) {
    this.navCtrl = navCtrl;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [this.user.email, Validators.required],
      password: [this.user.password, Validators.required],
    });
  }

  

  async login() {
    let loading = this.loadingCtrl.create({
      content: 'انتظر',
    });
    this.user = this.loginForm.value;
    let url = "login?"
      + "email=" + this.user.email
      + "&password=" + this.user.password
    loading.present().then(() => {
      this.api.post(url, this.user).then(data => {
        this.data = data;

        if (this.data.status) {
          this.api.profile = this.data.user;
          loading.dismiss()
          if (this.data.user.active == 1){
            if(this.data.end_account){ 
          this.api.saveAccessToken(this.data.user.api_token,this.data.user.level);
          this.api.saveuserid(this.data.user.id,this.data.user.logo,this.data.user.name,this.data.user.expire_to)
          this.events.publish('user:created', this.data.user, Date.now());                    
          this.navCtrl.setRoot(TabsPage);
            }
            else{
              this.api.showalert("تنبيه","عفواً لا يمكنكم الدخول ،، برجاء تجديد الاشتراك")
            }
          }
          else {
            this.api.showalert("", "هذا الحساب غير مفعل برجاء تفعيل الحساب")
            this.api.get("settings?api_token=" + localStorage.getItem(this.api.tokenStr)).then(data => {
              this.data = data;
              if (this.data.status) {
                if (this.data.data == "sms")
                  this.navCtrl.push(ActivationPage)
                else
                  this.api.showalert("", "يرجاء تفعيل الاكونت عبر الايميل من رساله التفعيل ")
              }
            })
          }
        }
        else{ 
          loading.dismiss()
          this.api.showalert("", this.data.message);
        }
      }).catch((error) => {
        loading.dismiss();        
        this.api.showalert("","حدث خطأ برجاء المحاوله مره اخري")
      })
    })
  }

  forgetpassword(){
    this.iab.create("http://s-baet.com/cp/password/reset");
  }

  goBack(){
    this.navCtrl.pop()
  }

}
