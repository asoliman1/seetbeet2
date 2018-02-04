import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { User } from "../../models/user";
import { FirebaseService } from "../../app/firebase-service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, public api: FirebaseService, private formBuilder: FormBuilder, public loadingCtrl: LoadingController) {

  }
  user = {} as User
  data: any;
  contactForm: FormGroup;

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, Validators.required],
      subject: [this.user.subject, Validators.required],
      message: [this.user.message, Validators.required],

    });
  }
  
  send() {
    let loading = this.loadingCtrl.create({
      content: 'انتظر',
    });
    this.user = this.contactForm.value;
    loading.present().then(() => {
      let url = "contactus?"
        + "name=" + this.user.name
        + "&email=" + this.user.email
        + "&title=" + this.user.subject
        + "&content=" + this.user.message
      this.api.post(url, this.user).then(data => {
        this.data = data
        loading.dismiss();
        if (!this.data.status)
          this.api.showalert("خطأ", this.data.messages)
        else
          this.api.showalert("", "تم الارسال بنجاح")
      }).catch((error) => {
        loading.dismiss();        
        this.api.showalert("","حدث خطأ برجاء المحاوله مره اخري")
      })
    })
  }

}
