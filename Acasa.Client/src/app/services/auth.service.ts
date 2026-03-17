import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7102'; // Verifică portul tău din appsettings.json
  
  // Use Angular Signals for reactive auth state (modern Angular 17/18+)
  isAuthenticated = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap(res => console.log('Register response:', res)),
      catchError(this.handleError)
    );
  }

  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        console.log('Login response received:', response);
        // Robust token extraction
        const token = response?.token || response?.accessToken || response?.tokenString || response?.access_token || response;
        
        if (typeof token === 'string' && token.length > 20) {
          localStorage.setItem('auth_token', token);
          this.isAuthenticated.set(true);
        } else if (response && typeof response === 'string' && response.length > 20) {
          // If the response IS the token string itself
          localStorage.setItem('auth_token', response);
          this.isAuthenticated.set(true);
        } else {
          console.warn('No valid token found in response!', response);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.status === 0) {
      console.error('Could not connect to backend. Is the server running at ' + 'https://localhost:7102' + '?');
    }
    return throwError(() => new Error(error.error?.message || 'A apărut o eroare. Vă rugăm să încercați din nou.'));
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isAuthenticated.set(false);
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }
}