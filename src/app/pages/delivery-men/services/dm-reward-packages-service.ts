import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FilterDateWithMode } from '@shared/types/common';
import { format } from 'date-fns';
import { DmService } from './dm-service';
import { DMRewardPackagesList, RewardPackage, RewardPackageForm } from '../types/delivery-men-reward-package';

@Injectable({
  providedIn: 'root',
})
export class DmRewardPackagesService extends DmService {

  getDmRewardPackages(params: FilterDateWithMode): Observable<DMRewardPackagesList> {
    const queryParams = new HttpParams({
      fromObject: {
        filter: params.filter,
        date: format(params.date, "yyyy-MM-dd"),
        page: params?.page ?? 1,
        itemsPerPage: params?.itemsPerPage ?? 10
      }
    });

    return this.http.get<DMRewardPackagesList>(`${this.apiUrl}/reward-packages/dm-rewards-list`, { params: queryParams });
  }

  getRewards(): Observable<RewardPackage[]> {
    return this.http.get<{ rewards: RewardPackage[] }>(`${this.apiUrl}/reward-packages`).pipe(
      map(response => response.rewards)
    );
  }

  createReward(reward: RewardPackageForm): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reward-packages`, reward);
  }

  updateReward(id: number, reward: RewardPackageForm): Observable<void> {
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
