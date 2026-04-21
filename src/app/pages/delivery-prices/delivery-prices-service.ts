import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { DeliveryPriceCity, DeliveryPriceCityUpdateForm, DeliveryPriceProvince, DeliveryPriceProvinceUpdateForm } from '@shared/types/delivery-price';
import { environment } from 'environments/environment';
import { SelectItemGroup } from 'primeng/api';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeliveryPricesService {
  // services
  private readonly http: HttpClient = inject(HttpClient);
  // vars
  private _cities: WritableSignal<SelectItemGroup[]> = signal<SelectItemGroup[]>([]);
  private _cooperatives: WritableSignal<SelectItemGroup[]> = signal<SelectItemGroup[]>([]);
  public cityOptions: Signal<SelectItemGroup[]> = computed(() => this._cities());
  public cooperativeOptions: Signal<SelectItemGroup[]> = computed(() => this._cooperatives());

  getAllCity(): Observable<DeliveryPriceCity[]> {    
    return this.http.get<{ deliveryPrices: DeliveryPriceCity[] }>(`${environment.apiURL}/delivery-prices/city`).pipe(
      map(data => data.deliveryPrices)
    );
  }

  getAllCityOptions(): Observable<SelectItemGroup[]> {    
    return this.http.get<{ deliveryPricesOptions: SelectItemGroup[] }>(`${environment.apiURL}/delivery-prices/city-options`).pipe(
      map(data => {
        this._cities.set(data.deliveryPricesOptions);
        return data.deliveryPricesOptions;
      })
    );
  }

  getAllCooperative(): Observable<DeliveryPriceProvince[]> {    
    return this.http.get<{ deliveryPrices: DeliveryPriceProvince[] }>(`${environment.apiURL}/delivery-prices/cooperative`).pipe(
      map(data => data.deliveryPrices)
    );
  }

  getAllCooperativeOptions(): Observable<SelectItemGroup[]> {    
    return this.http.get<{ deliveryPricesOptions: SelectItemGroup[] }>(`${environment.apiURL}/delivery-prices/cooperative-options`).pipe(
      map(data => {
        this._cooperatives.set(data.deliveryPricesOptions);
        return data.deliveryPricesOptions;
      })
    );
  }
  
  // create(data: DeliveryPriceUpdateForm): Observable<void> {
  //   return this.http.post<void>(`${environment.apiURL}/delivery-prices`, data);
  // }

  updateCity(data: DeliveryPriceCityUpdateForm): Observable<void> {
    return this.http.put<void>(`${environment.apiURL}/delivery-prices/city/${data.id}`, data);
  }

  updateCooperative(data: DeliveryPriceProvinceUpdateForm): Observable<void> {
    return this.http.put<void>(`${environment.apiURL}/delivery-prices/cooperative/${data.id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURL}/delivery-prices/${id}`);
  }
}
