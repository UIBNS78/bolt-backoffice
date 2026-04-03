import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DeliveryPriceCity, DeliveryPriceCityUpdateForm, DeliveryPriceProvince, DeliveryPriceProvinceUpdateForm } from '@shared/types/delivery-price';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeliveryPricesService {
  private http: HttpClient = inject(HttpClient);

  getAllTana(): Observable<DeliveryPriceCity[]> {    
    return this.http.get<{ deliveryPrices: DeliveryPriceCity[] }>(`${environment.apiURL}/delivery-prices/tana`).pipe(
      map(data => data.deliveryPrices)
    );
  }

  getAllCooperative(): Observable<DeliveryPriceProvince[]> {    
    return this.http.get<{ deliveryPrices: DeliveryPriceProvince[] }>(`${environment.apiURL}/delivery-prices/cooperative`).pipe(
      map(data => data.deliveryPrices)
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
