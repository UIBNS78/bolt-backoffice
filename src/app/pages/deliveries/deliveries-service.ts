import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DeliveryList } from './types/delivery-list';
import { environment } from 'environments/environment';
import { DeliveryCount } from './types/delivery-count';
import { DeliveryForm } from './types/delivery-form';

@Injectable({
  providedIn: 'root',
})
export class DeliveriesService {
  private readonly http: HttpClient = inject(HttpClient);

  getDeliveriesByOwners(pagination?: {
    itemsPerPage: number;
    page: number;
}): Observable<DeliveryList> {
    const params = new HttpParams({
      fromObject: {
        page: pagination ? pagination.page : 1,
        itemsPerPage: pagination ? pagination.itemsPerPage : 10
      }
    });
    
    return this.http.get<DeliveryList>(`${environment.apiURL}/deliveries/all-by-owners`, { params });
  }

  getDeliveryCount(): Observable<DeliveryCount> {
    return this.http.get<{ count: DeliveryCount }>(`${environment.apiURL}/deliveries/count`).pipe(
      map(data => data.count)
    );
  }

  create(data: DeliveryForm): Observable<void> {
    return this.http.post<void>(`${environment.apiURL}/deliveries`, data);
  }
}
