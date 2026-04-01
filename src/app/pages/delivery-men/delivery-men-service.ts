import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { DeliveryMan } from '@shared/types/delivery-men';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';
import type { DeliveryMenList } from './types/delivery-men-list';
import type { DeliveryMenOptionsResponse } from './types/delivery-men-options-response';

@Injectable({
  providedIn: 'root'
})
export class DeliveryMenService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(pagination?: {
    itemsPerPage: number;
    page: number;
}): Observable<DeliveryMenList> {
    const params = new HttpParams({
      fromObject: {
        page: pagination ? pagination.page : 1,
        itemsPerPage: pagination ? pagination.itemsPerPage : 10
      }
    });
    
    return this.http.get<DeliveryMenList>(`${environment.apiURL}/delivery-men/all`, { params });
  }
  
  getAllAsOptions(): Observable<DeliveryMenOptionsResponse[]> {
    return this.http.get<{ deliveryMen: DeliveryMenOptionsResponse[] }>(`${environment.apiURL}/delivery-men/all-options`).pipe(
      map(data => data.deliveryMen)
    );
  }
  
  create(data: DeliveryMan): Observable<void> {
    return this.http.post<void>(`${environment.apiURL}/delivery-men`, data);
  }

  update(data: DeliveryMan): Observable<void> {
    return this.http.put<void>(`${environment.apiURL}/delivery-men/${data.id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURL}/delivery-men/${id}`);
  }
}
