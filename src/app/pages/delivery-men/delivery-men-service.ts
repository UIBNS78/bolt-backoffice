import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import type { DeliveryManDetails } from '@shared/types/delivery-men';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';
import type { DeliveryMenList } from './types/delivery-men-list';
import type { DeliveryMenOptionsResponse } from './types/delivery-men-options-response';
import { InputSelectOptions } from '@shared/components/types/input-select-options';
import { Gender, GENDER } from '@shared/types/user';
import { DeliveryManSalary, DeliveryManSalaryForm, DeliveryMenSalaryList } from './types/delivery-men-salary';
import { FilterDateType } from '@shared/types/common';
import { format } from 'date-fns';
import { DeliveryMenRewardsList, PackageReward, PackageRewardForm } from './types/delivery-men-reward';

@Injectable({
  providedIn: 'root'
})
export class DeliveryMenService {
  private readonly http: HttpClient = inject(HttpClient);
  private _deliveryMen: WritableSignal<DeliveryMenOptionsResponse[]> = signal<DeliveryMenOptionsResponse[]>([]);

  public deliveryMenOptions: Signal<InputSelectOptions[]> = computed(() => 
    this._deliveryMen().map(dm => ({
      id: dm.id,
      label: `${dm.gender === GENDER.WOMAN ? "Mme" : "Mr"} ${dm.firstName}`
    }))
  );

  public deliveryMenAsUsersOptions: Signal<InputSelectOptions[]> = computed(() => 
    this._deliveryMen().map(dm => ({
      id: dm.userId,
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

  getOnlineCount(): Observable<{ onlineCount: number; totalCount: number }> {
    return this.http.get<{ onlineCount: number; totalCount: number }>(`${environment.apiURL}/delivery-men/online-count`);
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

  // SALARIES
  getSalaries(pagination?: {
    itemsPerPage: number;
    page: number;
}): Observable<DeliveryMenSalaryList> {
    const params = new HttpParams({
      fromObject: {
        page: pagination ? pagination.page : 1,
        itemsPerPage: pagination ? pagination.itemsPerPage : 10
      }
    });

    return this.http.get<DeliveryMenSalaryList>(`${environment.apiURL}/delivery-men/salaries`, { params });
  }

  getDeliveryManSalaryHistory(id: number): Observable<DeliveryManSalary[]> {
    return this.http.get<{ salaries: DeliveryManSalary[] }>(`${environment.apiURL}/delivery-men/salaries/history/${id}`).pipe(
      map(response => response.salaries)
    );
  }

  createSalary(data: DeliveryManSalaryForm): Observable<void> {
    return this.http.post<void>(`${environment.apiURL}/delivery-men/salaries`, data);
  }

  updateSalary(id: number, data: DeliveryManSalaryForm): Observable<void> {
    return this.http.put<void>(`${environment.apiURL}/delivery-men/salaries/${id}`, data);
  }

  // REWARDS
  getDeliveryMenRewards(params: FilterDateType): Observable<DeliveryMenRewardsList> {
    const queryParams = new HttpParams({
      fromObject: {
        filter: params.filter,
        date: format(params.date, "yyyy-MM-dd"),
        page: params?.page ?? 1,
        itemsPerPage: params?.itemsPerPage ?? 10
      }
    });

    return this.http.get<DeliveryMenRewardsList>(`${environment.apiURL}/delivery-men/rewards`, { params: queryParams });
  }

  getRewards(): Observable<PackageReward[]> {
    return this.http.get<{ rewards: PackageReward[] }>(`${environment.apiURL}/delivery-men/rewards/packages`).pipe(
      map(response => response.rewards)
    );
  }

  createReward(reward: PackageRewardForm): Observable<void> {
    return this.http.post<void>(`${environment.apiURL}/delivery-men/rewards/packages`, reward);
  }

  updateReward(id: number, reward: PackageRewardForm): Observable<void> {
    return this.http.put<void>(`${environment.apiURL}/delivery-men/rewards/packages/${id}`, reward);
  }

  deleteReward(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURL}/delivery-men/rewards/packages/${id}`);
  }

  activateReward(id: number): Observable<void> {
    return this.http.put<void>(`${environment.apiURL}/delivery-men/rewards/packages/${id}/activate`, null);
  }
}
