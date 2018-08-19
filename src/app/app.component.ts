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
  needInfo = ['btcusdt', 'ethbtc', 'ethusdt'];

  constructor(private http: HttpClient, private db: AngularFirestore) {
    console.log('>>> Currency goes here >>>');
  }

  ngOnInit() {
    const numbers = interval(1000 * 2);
    numbers.subscribe(() => this.getData());
  }

  getData() {
    this.sourceData = []
    this.db.collection('currencies').valueChanges()
      .subscribe(currencies => {
        this.sourceData = currencies;
        // get new AI signal

        this.http.get(API_SIGNAL)
          .subscribe((signal: any) => {
            this.newData = this.arrangData(signal);
            this.compareData();
          });
      });
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
      const matchedSignal = _.find(this.sourceData, { 'currency': newSignal.currency });

      if (matchedSignal) {
        if (newSignal.signal !== matchedSignal.signal && Number(matchedSignal.time) <= Number(newSignal.time)) {
          // //update data
          this.db.firestore.collection('currencies')
            .doc(newSignal.currency)
            .set(newSignal, { merge: true })
            .then(() => {
              console.log('Old: ', matchedSignal);
              console.log('New: ', newSignal);

              if (this.needInfo.includes(newSignal.currency)) {
                this.emailContent.push(`Currency: ${_.toUpper(matchedSignal.currency)} from ${_.toUpper(matchedSignal.signal)} to ${_.toUpper(newSignal.signal)} Old price: ${matchedSignal.price} >>> New price: ${newSignal.price}`);
                console.log(' >>> Important ', _.toUpper(newSignal.currency), ' <<<');
              }
              this.emailContent.push('newSignal', newSignal);
              console.log('-------------------------------------------------');

              this.sendEmail();
              this.emailContent = [];
            })
            .catch(err => console.log('update error', err));
        }
      }
    });


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
      }).fail(function (error) {
        console.log('Oops... ' + JSON.stringify(error));
      });
    }
  }
}
