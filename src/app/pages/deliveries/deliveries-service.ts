import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DeliveryList } from './types/delivery-list';
import { environment } from 'environments/environment';
import { DeliveryCount } from './types/delivery-count';
import { DeliveryForm } from './types/delivery-form';
import { Package } from '@shared/types/package';

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

  getPackagesByOwnersByDeliveryId(deliveryId: number): Observable<Package[]> {
    return this.http.get<{ packages: Package[] }>(`${environment.apiURL}/deliveries/packages/${deliveryId}`).pipe(
      map(data => data.packages)
    );

  }

  getDeliveryCount(): Observable<DeliveryCount> {
    return this.http.get<{ counts: DeliveryCount }>(`${environment.apiURL}/deliveries/count`).pipe(
      map(data => data.counts)
    );
  }

  updatePackage(id: number, pkg: Partial<Package>): Observable<void> {
    return this.http.patch<void>(`${environment.apiURL}/deliveries/package/${id}`, pkg)
  }
  
  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURL}/deliveries/package/${id}`);
  }

  create(data: DeliveryForm): Observable<void> {
    return this.http.post<void>(`${environment.apiURL}/deliveries`, data);
  }
}
