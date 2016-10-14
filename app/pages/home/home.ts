import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, ModalController, Tabs, AlertController, LoadingController, Storage, SqlStorage } from 'ionic-angular';
import { Device, SpinnerDialog, InAppBrowser, AdMob } from 'ionic-native';
import { Globals } from '../../globals';
import { Places } from '../../model/models';
import { EvaluatesModal } from '../evaluatesModal/evaluatesModal';


@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  storage: Storage;

  evaluated: any = [];
  comments: any = [];
  news: any = [];
  facebook: any = {};

  feedback: any = {}
  device: String;

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController, private loadingController: LoadingController, private http: Http) {
    SpinnerDialog.show("Aguarde...");
    this.storage = new Storage(SqlStorage);
    this.getHomeData(0);
    this.storage.get("uuid").then((res) => {
      this.device = res;
    });
  }

  goFacebook() {
    InAppBrowser.open("https://www.facebook.com/AppDaPraIr", "_system");
  }

  goListPlaces() {
    let t: Tabs = this.navCtrl.parent;
    t.select(1);
  }

  evaluates(place: Places) {
    this.modalCtrl.create(EvaluatesModal, { place: place }).present();
  }

  getHomeData(attempts: number = 0) {

    this.http.get(Globals.urlApi + "/api/V2/App/Home").map(res => res.json()).subscribe(data => {
      this.evaluated = data.Evaluated;
      this.comments = data.Comments;

      //this.loader.dismiss();
      SpinnerDialog.hide();
    }, (err) => {
      if (attempts == 0) {
        this.alertCtrl.create({
          title: "Erro!",
          subTitle: "Aparentemente você está sem conexão com a internet. Por favor, verifique se seu Wifi ou dados móveis estão ativos.",
          buttons: ["Ok"]
        }).present();
      }
      console.log(err);
      /*if(attempts < 5){
      attempts++;
      this.getHomeData(attempts);
      }*/
    });
  }




}
