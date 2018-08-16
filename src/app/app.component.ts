import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs/observable/interval';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import * as $ from 'jquery';

const API_SIGNAL = `https://signal3.exacoin.co/ai_all_signal?time=15m`;
const API_EMAil = `https://api.emailjs.com/api/v1.0/email/send`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sourceData = [
  {"time":1534388875332,"price":6205,"signal":"buy","currency":"btcusdt"},
  {"time":1534388875332,"price":0.0444,"signal":"buy","currency":"ethbtc"}]
  newData = []
  emailContent = []

  constructor(private http: HttpClient) {
    console.log('nick always here');
  }

  ngOnInit() {
    this.emailContent = [];
    const numbers = interval(1000 * 60 * 2);
    numbers.subscribe(() => this.getData());
  }

  getData() {
    if (_.isEmpty(this.sourceData)) {
      //call api to get data from api
      this.http.get(API_SIGNAL)
        .subscribe((res: any) => {
          this.sourceData = this.arrangData(res)
        })
    } else {
      this.http.get(API_SIGNAL)
        .subscribe((res: any) => {
          this.newData = this.arrangData(res)
        })
      this.compareData();
    }
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
        if (newSignal.signal !== matchedSignal.signal && (newSignal.currency === 'btcusdt' || newSignal.currency === 'ethbtc')) {
          console.log('Old signal: ', matchedSignal);
          console.log('New signal: ', newSignal);
          this.emailContent.push(`Old signal: ${JSON.stringify(matchedSignal)}. New signal: ${JSON.stringify(newSignal)}`);
            _.remove(this.sourceData, function(item) {
              return item.currency === newSignal.currency ;
            });
            this.sourceData.push(newSignal);
        }
      } else {
        this.sourceData.push(newSignal);
        console.log('New signal initial: ', newSignal);
        //this.emailContent.push('New signal initial: ', JSON.stringify(newSignal));
      }
    })

    this.sendEmail();
  }

  sendEmail() {
    const data = {
      service_id: 'gmail',
      template_id: 'template_RLzpQCde',
      user_id: 'user_RZxp7PcNtvPxnBMph4LaY',
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
