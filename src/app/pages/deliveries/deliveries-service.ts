import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DeliveryList } from './types/delivery-list';
import { environment } from 'environments/environment';
import { DeliveryCount } from './types/delivery-count';
import { DeliveryForm } from './types/delivery-form';
import { Package, PackageForm } from '@shared/types/package';
import { DeliveryDrawerForm } from './types/delivery-drawer-form';
import { DeliveryDetails } from './types/delivery-details';
import { DateRange } from '@shared/types/common';
import { DeliveryByDate } from '@shared/types/delivery';

@Injectable({
  providedIn: 'root',
})
export class DeliveriesService {
  private readonly http: HttpClient = inject(HttpClient);

  // DELIVERIES
  getDeliveriesByOwners(dates: DateRange): Observable<DeliveryList> {
    const params = new HttpParams({
      fromObject: dates
    });
    
    return this.http.get<DeliveryList>(`${environment.apiURL}/deliveries/all-by-owners`, { params });
  }

  getDeliveryByIdWithDate(id: number): Observable<DeliveryByDate | null> {
    return this.http.get<{ delivery: DeliveryByDate | null }>(`${environment.apiURL}/deliveries/${id}`).pipe(
      map(data => data.delivery)
    );
  }

  getDeliveryCount(): Observable<DeliveryCount> {
    return this.http.get<{ counts: DeliveryCount }>(`${environment.apiURL}/deliveries/count`).pipe(
      map(data => data.counts)
    );
  }

  getDeliveryDetails(id: number): Observable<DeliveryDetails | null> {
    return this.http.get<{ details: DeliveryDetails | null }>(`${environment.apiURL}/deliveries/details/${id}`).pipe(
      map(data => data.details)
    );
  }

  create(data: DeliveryForm): Observable<{ deliveryId: number }> {
    return this.http.post<{ deliveryId: number }>(`${environment.apiURL}/deliveries`, data);
  }

  update(data: DeliveryDrawerForm): Observable<void> {
    return this.http.patch<void>(`${environment.apiURL}/deliveries/${data.id}`, data);
  }

  // PACKAGES
  getPackagesByOwnersByDeliveryId(deliveryId: number): Observable<Package[]> {
    return this.http.get<{ packages: Package[] }>(`${environment.apiURL}/deliveries/packages/${deliveryId}`).pipe(
      map(data => data.packages)
    );
  }

  createPackage(pkg: PackageForm): Observable<void> {
    return this.http.post<void>(`${environment.apiURL}/deliveries/package`, pkg);
  }

  updatePackage(id: number, pkg: Partial<PackageForm>): Observable<void> {
    return this.http.patch<void>(`${environment.apiURL}/deliveries/package/${id}`, pkg)
  }
  
  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURL}/deliveries/package/${id}`);
  }
}
