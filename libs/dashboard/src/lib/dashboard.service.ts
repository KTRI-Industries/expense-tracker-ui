import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardControllerService, DashboardDto } from '@expense-tracker-ui/shared/api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardApi = inject(DashboardControllerService);

  getDashboard(startDate?: string, endDate?: string): Observable<DashboardDto> {
    return this.dashboardApi.getDashboard(startDate, endDate);
  }
}
