import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../services/request';
import { ServiceRequest } from '../../models/service-request';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './request-list.html',
  styleUrl: './request-list.css'
})
export class RequestList implements OnInit, OnChanges {
  @Input() refreshKey = 0;
  @Output() changed = new EventEmitter<void>();

  private readonly requestService = inject(RequestService);
  private readonly cdr = inject(ChangeDetectorRef);

  requests: ServiceRequest[] = [];
  filteredRequests: ServiceRequest[] = [];

  searchText = '';
  selectedStatus = 'All';
  loading = true;
  error = '';
  success = '';

  editingId: number | null = null;
  editTitle = '';
  editDescription = '';
  editPriority: 'Low' | 'Medium' | 'High' = 'Medium';
  editStatus: 'Open' | 'In Progress' | 'Closed' = 'Open';
  saving = false;

  ngOnInit(): void {
    this.loadRequests();
  }

 ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['refreshKey'] &&
      !changes['refreshKey'].firstChange
    ) {
      this.loadRequests();
    }
  }

  loadRequests(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.requestService.getAll().subscribe({
      next: requests => {
        console.log('Request list received:', requests);

        this.requests = requests ?? [];
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Request list API error:', err);

        this.error = 'Unable to load requests. Check the browser console.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    const query = this.searchText.trim().toLowerCase();

    this.filteredRequests = this.requests.filter(request => {
      const matchesSearch =
        request.title.toLowerCase().includes(query) ||
        request.description.toLowerCase().includes(query);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        request.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.applyFilters();
  }

  onStatusChange(value: string): void {
    this.selectedStatus = value;
    this.applyFilters();
  }

  startEdit(request: ServiceRequest): void {
    this.editingId = request.id;
    this.editTitle = request.title;
    this.editDescription = request.description;
    this.editPriority = request.priority;
    this.editStatus = request.status;
    this.error = '';
    this.success = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.error = '';
  }

  saveEdit(): void {
    if (this.editingId === null) return;

    if (!this.editTitle.trim() || !this.editDescription.trim()) {
      this.error = 'Title and description are required.';
      return;
    }

    const original = this.requests.find(r => r.id === this.editingId);
    if (!original) return;

    const updated: ServiceRequest = {
      ...original,
      title: this.editTitle.trim(),
      description: this.editDescription.trim(),
      priority: this.editPriority,
      status: this.editStatus
    };

    this.saving = true;
    this.error = '';
    this.success = '';

    this.requestService.update(this.editingId, updated).subscribe({
      next: savedRequest => {
        this.requests = this.requests.map(r =>
          r.id === savedRequest.id ? savedRequest : r
        );

        this.applyFilters();
        this.editingId = null;
        this.saving = false;
        this.success = 'Request updated successfully.';

        // Refresh dashboard statistics.
        this.changed.emit();
      },
      error: err => {
        console.error('Failed to update request:', err);
        this.error = 'Unable to update request. Please try again.';
        this.saving = false;
      }
    });
  }

  deleteRequest(request: ServiceRequest): void {
    if (!confirm(`Delete "${request.title}"?`)) return;

    this.requestService.delete(request.id).subscribe({
      next: () => {
        this.success = 'Request deleted successfully.';
        this.loadRequests();
        this.changed.emit();
      },
      error: err => {
        console.error('Failed to delete request:', err);
        this.error = 'Unable to delete the request.';
      }
    });
  }
}