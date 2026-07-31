import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DeliveryManSalary, DeliveryManSalaryForm, DeliveryMenSalaryList } from '../types/delivery-men-salary';
import { DmService } from './dm-service';

@Injectable({
  providedIn: 'root'
})
export class DmSalariesService extends DmService {

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

    return this.http.get<DeliveryMenSalaryList>(`${this.apiUrl}/salaries`, { params });
  }

  getDeliveryManSalaryHistory(id: number): Observable<DeliveryManSalary[]> {
    return this.http.get<{ salaries: DeliveryManSalary[] }>(`${this.apiUrl}/salaries/history/${id}`).pipe(
      map(response => response.salaries)
    );
  }

  createSalary(data: DeliveryManSalaryForm): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/salaries`, data);
  }

  updateSalary(id: number, data: DeliveryManSalaryForm): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/salaries/${id}`, data);
  }
}
