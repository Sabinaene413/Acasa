import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';
import { AuthService } from '../../../core/auth.service';
import { PropertyService } from '../../properties/services/property.service';
import { Property } from '../../properties/models/property.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header Profil -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="relative">
              <div class="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <i class="pi pi-user text-5xl text-primary-600"></i>
              </div>
              <button class="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <i class="pi pi-camera text-gray-600"></i>
              </button>
            </div>
            
            <div class="flex-grow text-center md:text-left">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Profilul Meu</h1>
              <p class="text-gray-500 mb-4 flex items-center justify-center md:justify-start gap-2">
                <i class="pi pi-envelope"></i>
                utilizator&#64;exemplu.ro
              </p>
              <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                <span class="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                  Cont Verificat
                </span>
                <span class="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                  Membru din: Iunie 2023
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-3 w-full md:w-auto">
              <button class="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2">
                <i class="pi pi-pencil"></i>
                Editează Profil
              </button>
              <button (click)="logout()" class="px-6 py-2.5 bg-white text-red-600 border border-red-100 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                <i class="pi pi-power-off"></i>
                Deconectare
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Sidebar Navigație -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              <div class="p-4 border-b border-gray-50 bg-gray-50/50">
                <h2 class="font-bold text-gray-900">Meniul Contului</h2>
              </div>
              <nav class="p-2">
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-primary-600 bg-primary-50 rounded-xl font-medium">
                  <i class="pi pi-home"></i>
                  Anunțurile Mele
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <i class="pi pi-heart"></i>
                  Favorite
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <i class="pi pi-search"></i>
                  Căutări Salvate
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <i class="pi pi-bell"></i>
                  Notificări
                </a>
                <div class="my-2 border-t border-gray-50"></div>
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <i class="pi pi-cog"></i>
                  Setări Securitate
                </a>
              </nav>
            </div>
          </div>

          <!-- Conținut Principal -->
          <div class="lg:col-span-2">
            <!-- Statistici Rapide -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div class="text-2xl font-bold text-gray-900">{{ myProperties.length }}</div>
                <div class="text-sm text-gray-500">Anunțuri Active</div>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div class="text-2xl font-bold text-gray-900">42</div>
                <div class="text-sm text-gray-500">Vizualizări Total</div>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center col-span-2 md:col-span-1">
                <div class="text-2xl font-bold text-gray-900">5</div>
                <div class="text-sm text-gray-500">Mesaje Noi</div>
              </div>
            </div>

            <!-- Lista de Anunțuri -->
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Anunțurile Mele</h2>
              <button (click)="router.navigate(['/add-property'])" class="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2">
                <i class="pi pi-plus-circle"></i>
                Adaugă Anunț Nou
              </button>
            </div>

            <div class="space-y-4">
              <!-- Card Anunț -->
              <div *ngFor="let property of myProperties" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                <div class="flex flex-col md:flex-row">
                  <div class="relative w-full md:w-48 h-48">
                    <img [src]="property.images && property.images.length > 0 ? property.images[0].url : 'https://placehold.co/400x300?text=Fara+Imagine'" 
                         [alt]="property.title"
                         class="w-full h-full object-cover">
                    <div class="absolute top-2 left-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                      {{ property.price | currency:'EUR':'symbol':'1.0-0' }}
                    </div>
                  </div>
                  
                  <div class="p-6 flex-grow">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">{{ property.title }}</h3>
                      <div class="flex gap-2">
                        <button (click)="router.navigate(['/edit-property', property.id])" class="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <i class="pi pi-pencil"></i>
                        </button>
                        <button class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <i class="pi pi-trash"></i>
                        </button>
                      </div>
                    </div>
                    
                    <p class="text-gray-500 text-sm mb-4 flex items-center gap-2">
                      <i class="pi pi-map-marker"></i>
                      {{ property.address }}, {{ property.city?.name }}
                    </p>

                    <div class="flex items-center justify-between">
                      <div class="flex gap-4">
                        <span class="text-xs text-gray-400 flex items-center gap-1">
                          <i class="pi pi-eye"></i> 124 vizualizări
                        </span>
                        <span class="text-xs text-gray-400 flex items-center gap-1">
                        </span>
                      </div>
                      <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold border border-primary-100">
                        Activ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- State: Gol -->
              <div *ngIf="myProperties.length === 0" class="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="pi pi-home text-gray-400 text-2xl"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Nu ai niciun anunț adăugat</h3>
                <p class="text-gray-500 mb-6 max-w-xs mx-auto">Vrei să vinzi sau să închiriezi o proprietate? Începe acum prin a adăuga primul tău anunț!</p>
                <button (click)="router.navigate(['/add-property'])" class="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all">
                  Adaugă Proprietate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  propertyService = inject(PropertyService);
  router = inject(Router);

  myProperties: Property[] = [];

  ngOnInit() {
    this.loadUserProperties();
  }

  loadUserProperties() {
    this.propertyService.getUserProperties().subscribe({
      next: (data) => this.myProperties = data,
      error: (err) => console.error('Error fetching user properties:', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
