import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

declare var Plotly: any;

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.css'],
})
export class CovidComponent implements OnInit {
  constructor(private router: Router, private dataService: DataService) {}
  allCountriesData: any = [];
  countriesList: any = [];
  singleCountryData: any = [];
  singleCountryJson = {
    active: '',
    confirmed: '',
    critical: '',
    deaths: '',
    recovered: '',
  };
  timeLineData: any = [];
  timeLineDataLimit = '15';
  globalCountryName: any = '';
  globalCountryCode: any = '';
  isPlotData: boolean = true;
  isTextData: boolean = true;
  isExportBtn: boolean = false;
  Email:any ="" 
  filePathJson = {
    'file_name':'',
    'email':''
  }
  

  ngOnInit(): void {
    var user = localStorage.getItem('email');
    this.globalCountryName = localStorage.getItem('country');
    if (user == '' || user == null) {
      window.alert('Authentication Error... Please Sign Up to continue...');
      this.router.navigateByUrl('/user-sign-up');
    }else{
      this.Email = user;
    }

    this.dataService.getCovidDataForAllCountries().subscribe((data) => {
      this.countriesList = [];
      this.allCountriesData = data;
      for (var i = 0; i < this.allCountriesData.data.length; i++) {
        var country_json = {
          name: '',
          code: '',
        };
        country_json.name = this.allCountriesData.data[i]['name'];
        country_json.code = this.allCountriesData.data[i]['code'];
        if (country_json.name == this.globalCountryName) {
          this.globalCountryCode = country_json.code;
          console.log(this.globalCountryCode);
        }
        this.countriesList.push(country_json);
      }
      this.singleCountryData = [];
      this.timeLineData = [];
      this.getSingleCountryData(this.globalCountryCode);
    });
  }

  getSingleCountryData(val: any) {
    this.dataService.getCovidDataForCountry(val).subscribe((data) => {
      this.singleCountryData = [];
      this.timeLineData = [];
      this.singleCountryData = data;
      this.timeLineData = this.singleCountryData.data['timeline'];
      this.singleCountryJson.confirmed =
        this.singleCountryData.data['latest_data']['confirmed'];
      this.singleCountryJson.critical =
        this.singleCountryData.data['latest_data']['critical'];
      this.singleCountryJson.deaths =
        this.singleCountryData.data['latest_data']['deaths'];
      this.singleCountryJson.recovered =
        this.singleCountryData.data['latest_data']['recovered'];
      if (this.timeLineData != []) {
        this.singleCountryJson.active = this.timeLineData[0]['active'];
      } else {
        this.singleCountryJson.active = '0';
      }
      this.defineTimeLine(this.timeLineDataLimit);
    });
  }

  defineTimeLine(val: any) {
    this.timeLineData = [];
    var tempTimeLineData = this.singleCountryData.data['timeline'];
    for (var i = 0; i < val; i++) {
      this.timeLineData.push(tempTimeLineData[i]);
    }
    this.timeLineDataLimit = val;
    this.isPlotData = true;
  }

  generateGraph(val: any) {
    this.isTextData = false;
    this.isPlotData = true;
    this.isExportBtn = true;

    var date = [];
    var confirmed = [];
    var deaths = [];
    var recovered = [];

    var sel = (<HTMLSelectElement>(
      document.getElementById('selcountry')
    ));

    var selectedcountry = (sel.options[sel.selectedIndex]).text;

    var timeline = (<HTMLSelectElement>document.getElementById('timeline'))
      .value;

    for (var i = 0; i < this.timeLineData.length; i++) {
      date.push(this.timeLineData[i]['date']);
      confirmed.push(this.timeLineData[i]['new_confirmed']);
      deaths.push(this.timeLineData[i]['new_deaths']);
      recovered.push(this.timeLineData[i]['new_recovered']);
    }

    var trace1 = {
      x: date,
      y: confirmed,
      name: 'Confirmed',
      type: 'bar',
    };

    var trace2 = {
      x: date,
      y: deaths,
      name: 'Deaths',
      type: 'bar',
    };

    var trace3 = {
      x: date,
      y: recovered,
      name: 'Recovered',
      type: 'bar',
    };

    var data = [trace1, trace3, trace2];

    var layout = { barmode: 'group' };

    if (val == 'show') {
      Plotly.newPlot('plotData', data, layout);
    } else if (val == 'download') {
      Plotly.newPlot('plotData', data, layout).then(function (gd: any) {
        Plotly.downloadImage(gd, {
          format: 'png',
          height: 700,
          width: 1360,
          filename: 'Covid_' + selectedcountry + '_' + timeline +'_days',
        });
      });

    this.filePathJson.file_name = 'Covid_' + selectedcountry + '_' + timeline +'_days.png' 
    this.filePathJson.email = this.Email;
    this.dataService.exportImageViaEmail(this.filePathJson).subscribe(
      (data)=>{
        if("SUCCESS" != data){
          window.alert('Error Occured while sending the mail in the background =>' + data)
        }
      }
    );
    }

  }

  generateData() {
    this.isPlotData = false;
    this.isTextData = true;
    this.isExportBtn = false;
    this.singleCountryData = [];
    this.timeLineData = [];
    var selectedcountry = (<HTMLSelectElement>(
      document.getElementById('selcountry')
    )).value;
    this.getSingleCountryData(selectedcountry);
  }
}
