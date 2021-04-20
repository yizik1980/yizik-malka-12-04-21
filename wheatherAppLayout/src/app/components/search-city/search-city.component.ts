import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromEvent, Observable } from 'rxjs';
import { catchError, debounceTime } from 'rxjs/operators';
import { LoadCitiesAction } from 'src/app/actions/city.actions';
import { LoadWeathersAction } from 'src/app/actions/weather.actions';
import { city } from 'src/app/model/city';
import { errorResponse } from 'src/app/model/error';
import { AppState } from './../../reducers';

@Component({
  selector: 'app-search-city',
  templateUrl: './search-city.component.html',
  styleUrls: ['./search-city.component.css']
})
export class SearchCityComponent implements OnInit, OnDestroy {
  cities: city[];
  // units = ['standard','metric','imperial'];
  choosenCity: city;
  showLoader: boolean;
  choosenCityName: string;
  @ViewChild('autocompelet')
  autocompelet: ElementRef;
  constructor(private store: Store<AppState>) { }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    const observeInput = fromEvent(this.autocompelet.nativeElement, 'input')
      .pipe(debounceTime(1000));
    fromEvent(this.autocompelet.nativeElement, 'focus').subscribe((e: InputEvent) => {
      observeInput.subscribe((ev: any) => {
        if (ev.target.value && ev.target.value.length > 2) {
          this.showLoader = true;
          this.store.dispatch(LoadCitiesAction({ city: ev.target.value }))
        }
      });
    })
    fromEvent(this.autocompelet.nativeElement, 'blue').subscribe((e: InputEvent) => {
      observeInput.subscribe();
    })

  }

  selectCity($event: city) {
    this.choosenCity = $event;
    this.choosenCityName = $event.LocalizedName;
    this.store.dispatch(LoadWeathersAction({ cityName: this.choosenCity.Key }))
  }

  ngOnInit(): void {
    
    this.store.select(store => store.cities?.cities).subscribe(cities => {
      this.showLoader = false;
      this.cities = cities;
    });
  }

  focusCity($event: any) {
    this.showLoader = true;
  }

  showWeather() {
    if (this.choosenCity) {
      this.store.dispatch(LoadWeathersAction({ cityName: this.choosenCity.LocalizedName }));
    }
  }

}