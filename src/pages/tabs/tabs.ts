import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { StoresPage } from '../stores/stores';
import { OffersPage } from '../offers/offers';
import { FirebaseService } from '../../app/firebase-service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = StoresPage;
  tab3Root = ContactPage;
  tab4Root = OffersPage
  data:any;
  loading:boolean;
  banners=[];
  constructor(public api:FirebaseService) {
    this.loading=true;
    this.api.get("banners").then(data=>{
      this.data=data;
      this.banners=this.data.data
      this.loading=false;
    })

  }
}
