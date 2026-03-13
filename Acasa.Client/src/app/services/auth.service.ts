import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7102'; // Verifică portul tău din appsettings.json
  
  // Use Angular Signals for reactive auth state (modern Angular 17/18+)
  isAuthenticated = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isAuthenticated.set(false);
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }
}