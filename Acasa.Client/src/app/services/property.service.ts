import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property } from '../models/property.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private apiUrl = 'https://localhost:7102/api';

  constructor(private http: HttpClient){}

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/properties`)
  }

  createProperty(formData: FormData): Observable<Property> {
    return this.http.post<Property>(`${this.apiUrl}/properties`, formData);
  }
}
