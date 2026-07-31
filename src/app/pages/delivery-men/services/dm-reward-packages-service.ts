import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FilterDateType } from '@shared/types/common';
import { format } from 'date-fns';
import { DeliveryMenRewardsList, PackageReward, PackageRewardForm } from '../types/delivery-men-reward';
import { DmService } from './dm-service';

@Injectable({
  providedIn: 'root',
})
export class DmRewardPackagesService extends DmService {

  getDmRewardPackages(params: FilterDateType): Observable<DeliveryMenRewardsList> {
    const queryParams = new HttpParams({
      fromObject: {
        filter: params.filter,
        date: format(params.date, "yyyy-MM-dd"),
        page: params?.page ?? 1,
        itemsPerPage: params?.itemsPerPage ?? 10
      }
    });

    return this.http.get<DeliveryMenRewardsList>(`${this.apiUrl}/reward-packages/dm-rewards-list`, { params: queryParams });
  }

  getRewards(): Observable<PackageReward[]> {
    return this.http.get<{ rewards: PackageReward[] }>(`${this.apiUrl}/reward-packages`).pipe(
      map(response => response.rewards)
    );
  }

  createReward(reward: PackageRewardForm): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reward-packages`, reward);
  }

  updateReward(id: number, reward: PackageRewardForm): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reward-packages/${id}`, reward);
  }

  deleteReward(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reward-packages/${id}`);
  }

  activateReward(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reward-packages/${id}/activate`, null);
  }

  deactivateRewards(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reward-packages/deactivate`, null);
  }
}
