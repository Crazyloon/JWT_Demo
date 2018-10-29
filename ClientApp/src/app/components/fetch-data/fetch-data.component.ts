import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../../services/account.service';

const httpOptions = (token) =>  { return {
  headers: new HttpHeaders(
    { 
      'Content-Type': 'application/json', 
      'Authorization': `${token}`
    }),
  }
};

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  loadingErrorText: string = "Loading...";
  public forecasts: WeatherForecast[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, accountService: AccountService) {
    const token = accountService.getToken();
    const options = httpOptions(token);
    http.get<WeatherForecast[]>(baseUrl + 'api/SampleData/WeatherForecasts', options).subscribe(result => {
      this.forecasts = result;
    }, error => this.loadingErrorText = `Error: ${error.statusText}`);
  }
}

interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
