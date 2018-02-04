import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { FirebaseService } from "./firebase-service";


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { GetlocationPage } from '../pages/getlocation/getlocation';
import { InvoicesPage } from '../pages/invoices/invoices';
import { LoginPage } from '../pages/login/login';
import { MessagedetailsPage } from '../pages/messagedetails/messagedetails';
import { MessagesPage } from '../pages/messages/messages';
import { OffersPage } from '../pages/offers/offers';
import { ProductdetailsPage } from '../pages/productdetails/productdetails';
import { SignupPage } from '../pages/signup/signup';
import { StartPage } from '../pages/start/start';
import { StoresPage } from '../pages/stores/stores';
import { SubscribtionsPage } from '../pages/subscribtions/subscribtions';
import { AddproductPage } from '../pages/addproduct/addproduct';
import { ProfilePage } from '../pages/profile/profile';
import { NotificationsPage } from '../pages/notifications/notifications';
import { MyproductsPage } from '../pages/myproducts/myproducts';
import { ActivationPage } from '../pages/activation/activation';
import { HttpModule } from '@angular/http';
import { ProductslistPage } from '../pages/productslist/productslist';
import { Geolocation } from '@ionic-native/geolocation';
import { OneSignal } from '@ionic-native/onesignal';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Diagnostic } from '@ionic-native/diagnostic';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file'
import { InvoiceactionPage } from '../pages/invoiceaction/invoiceaction';
import { NewmessagePage } from '../pages/newmessage/newmessage';
import { Ionic2RatingModule } from 'ionic2-rating';
import { RulesPage } from '../pages/rules/rules';





@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    InvoiceactionPage,
    HomePage,
    TabsPage,
    EditprofilePage,
    GetlocationPage,
    InvoicesPage,
    LoginPage,
    MessagedetailsPage,
    MessagesPage,
    OffersPage,
    ProductdetailsPage,
    ProductslistPage,
    SignupPage,
    StartPage,
    StoresPage,
    SubscribtionsPage,
    AddproductPage,
    ProfilePage,
    NotificationsPage,
    MyproductsPage,
    ActivationPage,
    NewmessagePage,
    RulesPage
    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
        scrollAssist: false, 
        autoFocusAssist: false
    }),
    Ionic2RatingModule    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    InvoiceactionPage,
    HomePage,
    TabsPage,
    EditprofilePage,
    GetlocationPage,
    InvoicesPage,
    LoginPage,
    MessagedetailsPage,
    MessagesPage,
    OffersPage,
    ProductdetailsPage,
    ProductslistPage,
    SignupPage,
    StartPage,
    StoresPage,
    SubscribtionsPage,
    AddproductPage,
    ProfilePage,
    NotificationsPage,
    MyproductsPage,
    ActivationPage,
    NewmessagePage,
    RulesPage
  ],
  providers: [
    FirebaseService, 
    FileTransfer,
    File,
    ImagePicker,
    Diagnostic,
    PhotoViewer,
    InAppBrowser,
    Network,
    OneSignal,
    Geolocation,   
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
