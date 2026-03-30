import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col bg-light-gray text-navy font-sans pt-[64px]">
      <app-navbar></app-navbar>
    
      <main class="flex-grow flex flex-col items-center py-12 px-4">
        <div class="max-w-4xl w-full space-y-8">
          <!-- Profile Card -->
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-peach/20 p-8 md:p-12">
            <div class="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-gray-100 pb-12">
              <div class="w-32 h-32 bg-orange/20 rounded-full flex items-center justify-center text-orange shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="text-center md:text-left space-y-2">
                <h1 class="text-3xl font-extrabold tracking-tight">Profilul Meu</h1>
                <p class="text-navy/60 font-medium">Bine ai venit înapoi pe Acasă!</p>
              </div>
            </div>
    
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-6">
                <h2 class="text-xl font-bold text-navy flex items-center gap-2">
                  <span class="w-1.5 h-6 bg-orange rounded-full"></span>
                  Informații Cont
                </h2>
                <div class="space-y-4">
                  <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p class="text-xs font-bold text-navy/40 uppercase tracking-widest mb-1">Status Cont</p>
                    <p class="font-bold text-navy flex items-center gap-2">
                      <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                      Activ
                    </p>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p class="text-xs font-bold text-navy/40 uppercase tracking-widest mb-1">Membru din</p>
                    <p class="font-bold text-navy">Martie 2026</p>
                  </div>
                </div>
              </div>
    
              <div class="space-y-6">
                <h2 class="text-xl font-bold text-navy flex items-center gap-2">
                  <span class="w-1.5 h-6 bg-orange rounded-full"></span>
                  Acțiuni Rapide
                </h2>
                <div class="grid grid-cols-1 gap-3">
                  <button (click)="router.navigate(['/add-property'])" class="w-full h-14 bg-navy text-white rounded-xl font-bold hover:bg-orange transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Adaugă un anunț nou
                  </button>
                  <button (click)="logout()" class="w-full h-14 border-2 border-navy text-navy rounded-xl font-bold hover:bg-navy hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Deconectare
                  </button>
                </div>
              </div>
            </div>
          </div>
    
          <!-- My Ads Section -->
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-peach/20 p-8 md:p-12">
            <h2 class="text-2xl font-bold text-navy mb-8 flex items-center gap-3">
              <span class="w-2 h-8 bg-orange rounded-full"></span>
              Anunțurile mele
            </h2>
    
            @if (myProperties.length === 0) {
              <div class="text-center py-12 space-y-4">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-navy/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p class="text-navy/60 font-medium">Nu ai publicat încă niciun anunț.</p>
                <button (click)="router.navigate(['/add-property'])" class="text-orange font-bold hover:underline">Adaugă primul tău anunț acum!</button>
              </div>
            }
    
            @if (myProperties.length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                @for (property of myProperties; track property) {
                  <div
                    class="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-orange/30 hover:shadow-lg transition-all relative">
                    <div [routerLink]="['/property', property.id]" class="cursor-pointer">
                      <div class="aspect-video relative overflow-hidden">
                        @if (property.images && property.images.length > 0) {
                          <img [src]="property.images[0].url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        }
                        <div class="absolute inset-0 bg-navy/20"></div>
                        <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-navy shadow-sm">
                          {{ property.price | currency:'EUR':'symbol':'1.0-0' }}
                        </div>
                      </div>
                      <div class="p-6 space-y-2">
                        <h3 class="font-bold text-navy group-hover:text-orange transition-colors truncate">{{ property.title }}</h3>
                        <div class="flex items-center gap-4 text-xs font-medium text-navy/60">
                          <span class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {{ property.bedrooms }} dorm.
                          </span>
                          <span class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            {{ property.surfaceArea }} m²
                          </span>
                        </div>
                      </div>
                    </div>
                    <!-- Edit Button Overlay -->
                    <div class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button [routerLink]="['/edit-property', property.id]" class="bg-navy text-white p-2 rounded-lg shadow-lg hover:bg-orange transition-colors flex items-center gap-2 text-xs font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editează
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </main>
    
      <!-- Bottom Accent -->
      <div class="h-2 bg-peach w-full mt-auto"></div>
    </div>
    `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  propertyService = inject(PropertyService);
  router = inject(Router);

  myProperties: Property[] = [];

  ngOnInit() {
    this.fetchMyProperties();
  }

  fetchMyProperties() {
    this.propertyService.getUserProperties().subscribe({
      next: (data) => this.myProperties = data,
      error: (err) => console.error('Error fetching user properties:', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
