import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import type { DeliveryManDetails } from '@shared/types/delivery-men';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';
import type { DeliveryMenList } from './types/delivery-men-list';
import type { DeliveryMenOptionsResponse } from './types/delivery-men-options-response';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { Gender, GENDER } from '@shared/types/user';

@Injectable({
  providedIn: 'root'
})
export class DeliveryMenService {
  private readonly http: HttpClient = inject(HttpClient);
  private _deliveryMen: WritableSignal<DeliveryMenOptionsResponse[]> = signal<DeliveryMenOptionsResponse[]>([]);

  public options: Signal<InputSelectOptions[]> = computed(() => 
    this._deliveryMen().map(dm => ({
      id: dm.id,
      label: `${dm.gender === GENDER.WOMAN ? "Mme" : "Mr"} ${dm.firstName}`
    }))
  );

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
      map(data => {
        this._deliveryMen.set(data.deliveryMen);
        return data.deliveryMen;
      })
    );
  }

  getDetails(id: number): Observable<DeliveryManDetails> {
    return this.http.get<{ deliveryMan: DeliveryManDetails }>(`${environment.apiURL}/delivery-men/details/${id}`).pipe(
      map(data => data.deliveryMan)
    );
  }
  
  create(data: FormData): Observable<void> {
    return this.http.post<{ deliveryManId: number; userId: number }>(`${environment.apiURL}/delivery-men`, data).pipe(
      map(({ deliveryManId, userId }) => {
        this._deliveryMen.update(dm => [...dm, {
          id: deliveryManId,
          userId: userId,
          name: data.get("name") as string,
          firstName: data.get("firstName") as string,
          gender: data.get("gender") as Gender
        }]);
      })
    );
  }

  update(id: number, data: FormData): Observable<void> {
    return this.http.put<void>(`${environment.apiURL}/delivery-men/${id}`, data).pipe(
      map(() => {
        this._deliveryMen.update(dm => {
          const index = dm.findIndex(d => d.id === id);
          if (index !== -1) {
            dm[index] = {
              id,
              userId: data.get("userId") as unknown as number,
              name: data.get("name") as string,
              firstName: data.get("firstName") as string,
              gender: data.get("gender") as Gender
            };
          }
          return dm;
        });
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURL}/delivery-men/${id}`).pipe(
      map(() => {
        this._deliveryMen.update(dm => dm.filter(d => d.id !== id));
      })
    );
  }
}
