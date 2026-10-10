import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { RequestService } from '../../services/request';
import { ServiceRequest } from '../../models/service-request';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  imports: [DatePipe],
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly requestService = inject(RequestService);
  private readonly cdr = inject(ChangeDetectorRef);

  requests: ServiceRequest[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.error = '';

    this.requestService.getAll().subscribe({
      next: requests => {
        this.requests = requests ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Dashboard API error:', err);
        this.error = 'Unable to load service requests.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get total(): number {
    return this.requests.length;
  }

  get open(): number {
    return this.requests.filter(r => r.status === 'Open').length;
  }

  get inProgress(): number {
    return this.requests.filter(r => r.status === 'In Progress').length;
  }

  get closed(): number {
    return this.requests.filter(r => r.status === 'Closed').length;
  }

  get highPriority(): number {
    return this.requests.filter(r => r.priority === 'High').length;
  }

  get mediumPriority(): number {
    return this.requests.filter(r => r.priority === 'Medium').length;
  }

  get lowPriority(): number {
    return this.requests.filter(r => r.priority === 'Low').length;
  }

  get recentRequests(): ServiceRequest[] {
    return [...this.requests]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }

  priorityPercent(count: number): number {
    return this.total === 0 ? 0 : (count / this.total) * 100;
  }

}
