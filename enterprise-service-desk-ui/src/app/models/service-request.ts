
export interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
}

export interface CreateServiceRequest {
  title: string;
  description: string;
}