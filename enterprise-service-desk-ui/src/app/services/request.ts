
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ServiceRequest,
  CreateServiceRequest
} from '../models/service-request';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/requests';

  getAll(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(this.apiUrl);
  }

  getById(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.apiUrl, request);
  }

  update(
    id: number,
    request: ServiceRequest
  ): Observable<ServiceRequest> {
    return this.http.put<ServiceRequest>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}