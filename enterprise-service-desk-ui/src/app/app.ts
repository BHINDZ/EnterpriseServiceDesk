import { Component, ViewChild } from '@angular/core';
import { Dashboard } from './components/dashboard/dashboard';
import { RequestList } from './components/request-list/request-list';
import { RequestForm } from './components/request-form/request-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Dashboard, RequestList, RequestForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild(Dashboard) dashboard!: Dashboard;

  showForm = false;
  refreshKey = 0;

  openForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  onRequestCreated(): void {
    this.showForm = false;
    this.refreshKey++;
    this.dashboard.loadRequests();
  }

  onRequestChanged(): void {
    this.refreshKey++;
    this.dashboard.loadRequests();
  }
}
