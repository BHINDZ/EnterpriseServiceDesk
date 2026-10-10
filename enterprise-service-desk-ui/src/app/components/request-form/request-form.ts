import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../services/request';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './request-form.html',
  styleUrl: './request-form.css'
})
export class RequestForm {
  private readonly requestService = inject(RequestService);

  @Output() cancelled = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  title = '';
  description = '';
  submitting = false;
  error = '';

  submit(): void {
    if (!this.title.trim() || !this.description.trim()) {
      this.error = 'Please enter both a title and description.';
      return;
    }

    this.submitting = true;
    this.error = '';

    this.requestService.create({
      title: this.title.trim(),
      description: this.description.trim()
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.created.emit();
      },
      error: err => {
        console.error('Create request failed:', err);
        this.submitting = false;
        this.error = 'Unable to create request. Please try again.';
      }
    });
  }
}

