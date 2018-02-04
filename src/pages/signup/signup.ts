import { Component } from '@angular/core';
import { NavController, LoadingController, ViewController, AlertController, Events } from 'ionic-angular';
import { User } from '../../models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FirebaseService } from '../../app/firebase-service';
import { ActivationPage } from '../activation/activation';
import { TabsPage } from '../tabs/tabs';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  level: string="";

  check:boolean;
      registerForm: FormGroup;
      user = {} as User;
      constructor(public navCtrl: NavController, public viewCtrl: ViewController, public api: FirebaseService, private formBuilder: FormBuilder, public loadingCtrl: LoadingController,public alertCtrl: AlertController,public events: Events) {
          this.navCtrl = navCtrl;
  
      }
      ngOnInit() {
          this.registerForm = this.formBuilder.group({
              name: [this.user.name, Validators.required],
              email: [this.user.email, Validators.required],
              mobile: [this.user.mobile, Validators.required],
              password: [this.user.password, Validators.required],
              password_confirm: [this.user.password_confirm, Validators.required]
  
          });
      }

      public data: any;
  
      register() {
          this.user = this.registerForm.value;
          let loading = this.loadingCtrl.create({
              content: 'انتظر',
          });
  
          if (this.check||this.level=="") {
              loading.present().then(() => {
                  let url = "register?"
                      + "name=" + this.user.name
                      + "&email=" + this.user.email
                      + "&password=" + this.user.password
                      + "&password_confirmation=" + this.user.password_confirm
                      + "&mobile=" + this.user.mobile
                      + "&level=" + this.level
                      console.log(url)
                  this.api.post(url, this.user).then(data => {
                      this.data = data;
                      loading.dismiss()
                      if (this.data.status) {
                          this.api.profile = this.data.user;
                          if (this.data.type == "sms" && this.data.status){
                      this.api.saveAccessToken(this.data.user.api_token,this.data.user.level)
                              this.navCtrl.push(ActivationPage)
                          }
                          else if(this.data.type =="auto_active"){
                            this.api.saveAccessToken(this.data.user.api_token,this.data.user.level);
                            this.api.saveuserid(this.data.user.id.toString(),null,this.data.user.name,this.data.user.expire_to);
                            this.events.publish('user:created', this.data.user, Date.now());                                                
                            this.navCtrl.setRoot(TabsPage);
                          }
  
                      }
                      if(this.data.messages)
                      this.api.showalert("", this.data.messages)
  
  
                  }).catch((error) => {
                      loading.dismiss();
                      this.api.showalert("", "حدث خطأ برجاء المحاوله مره اخري")
                  })
              })
  
          }
          else{
            if(!this.check)
            this.api.showalert("", "برجاء الموافقه علي الشروط و الاحكام")
            else{
            this.api.showalert("", " برجاء تحديد نوع العضويه")            
            }
          }
      }
  
      getrules() {
          let url = "page/2"
          this.api.get(url).then(data => {
              this.data = data;
              let alert = this.alertCtrl.create({
                  title: "الشروط و الاحكام",
                  message:this.data.data.content,
                  buttons: ['الغاء'],
                  cssClass: 'alert_rules'
              });
              alert.present();
          }).catch((error) => {
          this.api.showalert("","حدث خطأ برجاء المحاوله مره اخري")
        })
      }
  
  goBack(){
    this.navCtrl.pop()
  }

}
