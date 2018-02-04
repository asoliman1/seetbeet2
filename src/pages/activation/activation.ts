import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseService } from "../../app/firebase-service";
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-activation',
  templateUrl: 'activation.html',
})
export class ActivationPage {
  loading = this.loadingCtrl.create({
    content: 'انتظر',
  });
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: FirebaseService, public loadingCtrl: LoadingController) {
  }
  code: any;
  data: any;
  activate() {
    this.loading.present().then(() => {
      this.api.post("active/mobile/code?code=" + this.code, this.code).then(data => {
        this.data = data;
        this.loading.dismiss();
        if (this.data.status) {
          this.api.showalert("", "تم تفعيل الحساب بنجاح")
          this.navCtrl.setRoot(TabsPage);
        }
      }).catch((error) => {
        this.loading.dismiss();        
        this.api.showalert("","حدث خطأ برجاء المحاوله مره اخري")
      })
    })
  }
  goBack() {
    this.navCtrl.pop();
  }
  resend() {
    this.loading.present().then(() => {
      let url = "resend/sms/mobile?api_token=" + localStorage.getItem(this.api.tokenStr)
      this.api.get(url).then(data => {
        this.data = data;
        this.loading.dismiss()
        if (this.data.message)
          this.api.showalert("", this.data.message)
      })
    }).catch((error) => {
        this.loading.dismiss();        
        this.api.showalert("","حدث خطأ برجاء المحاوله مره اخري")
      })
  }


}
