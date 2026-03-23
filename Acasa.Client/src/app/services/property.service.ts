import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Property, PropertyFilter } from '../models/property.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private apiUrl = 'https://localhost:7102/api/properties';
  private http = inject(HttpClient);

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl);
  }

  getFilteredProperties(filter: PropertyFilter): Observable<Property[]> {
    let params = new HttpParams();
    if (filter.minPrice !== undefined && filter.minPrice !== null) params = params.set('MinPrice', filter.minPrice.toString());
    if (filter.maxPrice !== undefined && filter.maxPrice !== null) params = params.set('MaxPrice', filter.maxPrice.toString());
    if (filter.bedrooms !== undefined && filter.bedrooms !== null) params = params.set('Bedrooms', filter.bedrooms.toString());
    if (filter.cityId !== undefined && filter.cityId !== null) params = params.set('CityId', filter.cityId.toString());

    return this.http.get<Property[]>(this.apiUrl, { params });
  }

  createProperty(formData: FormData): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, formData);
  }
}
