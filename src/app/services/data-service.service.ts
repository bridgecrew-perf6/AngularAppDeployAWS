import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { DateWiseData } from '../models/date-wise-data';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataURl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-03-2020.csv';
  private dateWiseDataURL='https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  constructor(private http : HttpClient) { }

  getDateWiseDate(){
    return this.http.get(this.dateWiseDataURL,{responseType:'text'})
    .pipe(map(result=>{

      let rows = result.split('\n');
      console.log(rows);
      let mainData= {};
      let header= rows[0];
      let dates =header.split(/,(?=\S)/)
      dates.splice(0 , 4);
      rows.splice(0,1);

      rows.forEach(row =>{
        let cols= row.split(/,(?=\S)/)
        let con= cols[1];
        cols.splice(0 , 4);
        console.log(con, cols);
        mainData[con]=[];
        cols.forEach((value , index)=>{

          let dw: DateWiseData ={
            cases : +value ,
            country: con ,
            date: new Date(Date.parse(dates[index]))

          }
          mainData[con].push(dw)

        })

      })

      // console.log(mainData);
      
      return mainData;
    }))
  }

  getGlobalData(){
    return this.http.get(this.globalDataURl, {responseType: 'text'}).pipe(
      map(result => {

        let data: GlobalDataSummary[]=[];
        let raw={}
        let rows = result.split('\n');
        rows.splice(0,1);
        //console.log(rows);

        rows.forEach(row=>{
          let cols =row.split(/,(?=\S)/)

          let cs= {
            country : cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],

          };

          let temp : GlobalDataSummary = raw[cs.country];
          if(temp){
            temp.active=cs.active + temp.active
            temp.confirmed=cs.confirmed + temp.confirmed
            temp.deaths=cs.deaths + temp.deaths
            temp.recovered=cs.recovered + temp.recovered

            raw[cs.country] = temp;

          }else{
            raw[cs.country] = cs;
          }

        })

        //console.log(raw);
        

        return <GlobalDataSummary[]>Object.values(raw);
       
      })
    )

  }
}