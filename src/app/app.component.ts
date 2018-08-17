import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs/observable/interval';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { AngularFirestore } from 'angularfire2/firestore';

const API_SIGNAL = `https://signal3.exacoin.co/ai_all_signal?time=5m`;
const API_EMAil = `https://api.emailjs.com/api/v1.0/email/send`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sourceData = []
  newData = []
  emailContent = []

  constructor(private http: HttpClient, private db: AngularFirestore) {
    console.log('>>> Currency goes here');

    //get data currencies
    db.collection('currencies').valueChanges()
      .subscribe(res => this.sourceData = res)
  }

  ngOnInit() {
    const numbers = interval(1000 * 5 * 60);
    numbers.subscribe(() => this.getData());
  }

  getData() {
    this.http.get(API_SIGNAL)
      .subscribe((res: any) => {
        this.newData = this.arrangData(res)
      })
    this.compareData();

  }

  arrangData(data: any) {
    const arrangedData = [];
    _.forEach(data.buy, (item: any) => { arrangedData.push(item) });
    _.forEach(data.sell, (item: any) => { arrangedData.push(item) });
    return arrangedData;
  }

  compareData() {
    //compare new signal with source data
    //if existed
    //  then compare is new or old?
    //    if new then push in source data
    //    else old then compare with the exist value
    _.forEach(this.newData, (newSignal: any) => {
      const matchedSignal;
      this.db.collection('currencies').doc(newSignal.currency).get()
          .then(function(doc) {
            if (doc.exists) {
              matchedSignal = doc.data();
            }
          });
            
      if (matchedSignal) {
        if (newSignal.signal !== matchedSignal.signal && Number(matchedSignal.time) <= Number(newSignal.time)) {
          console.log('Old: ', matchedSignal, ' >>> New: ', newSignal);

          if (['btcusdt', 'ethbtc', 'ethusdt', 'trxbtc', 'adabtc', 'xrpbtc'].includes(newSignal.currency)) {
            this.emailContent.push(`Currency: ${_.toUpper(matchedSignal.currency)} from ${_.toUpper(matchedSignal.signal)} to ${_.toUpper(newSignal.signal)} Old price: ${matchedSignal.price} >>> New price: ${newSignal.price}`);
          }

          //remove old data and add new data
          this.db.collection('currencies').doc(matchedSignal.currency)
            .set(matchedSignal, { merge: true });
        }
      } else {
        //add new data to db
        this.db.collection("currencies").doc(newSignal.currency).set(newSignal);
        console.log('Signal initial: ', newSignal);
      }

    })

    this.sendEmail();
  }

  sendEmail() {
    const data = {
      service_id: 'gmail',
      template_id: 'template_us4DgScN',
      user_id: 'user_gotw1qWCLxdAf2jkKBZGl',
      template_params: {
        'email_content': JSON.stringify(this.emailContent),
      }
    };
    if (!_.isEmpty(this.emailContent)) {
      $.ajax(API_EMAil, {
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json'
      }).done(function () {
        console.log('Your mail is sent!');
        this.emailContent = [];
      }).fail(function (error) {
        console.log('Oops... ' + JSON.stringify(error));
      });
    }
  }
}
