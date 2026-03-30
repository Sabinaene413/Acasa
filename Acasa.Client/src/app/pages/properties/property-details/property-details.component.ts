import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { Property } from '../../../models/property.model';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <div class="min-h-screen bg-light-gray text-navy font-sans pt-[64px] flex flex-col">
      <app-navbar></app-navbar>
    
      <main class="flex-grow container mx-auto px-4 py-8">
        @if (property) {
          <div class="max-w-6xl mx-auto space-y-8">
            <!-- Breadcrumbs -->
            <nav class="flex text-sm font-medium text-navy/60">
              <a routerLink="/" class="hover:text-orange">Acasă</a>
              <span class="mx-2">/</span>
              <span class="text-navy">Detalii Proprietate</span>
            </nav>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Left Column: Media & Description -->
              <div class="lg:col-span-2 space-y-8">
                <!-- Image Gallery -->
                <div class="bg-white rounded-3xl overflow-hidden shadow-xl border border-peach/10">
                  <div class="relative aspect-video">
                    <img [src]="currentImage" class="w-full h-full object-cover" [alt]="property.title">
                    <div class="absolute top-4 left-4 bg-orange text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                      {{ property.price | currency:'EUR':'symbol':'1.0-0' }}
                    </div>
                  </div>
                  <!-- Thumbnails -->
                  @if (property.images && property.images.length > 1) {
                    <div class="p-4 flex gap-4 overflow-x-auto">
                      @for (img of property.images; track img) {
                        <div
                          (click)="currentImage = img.url"
                          [class.border-orange]="currentImage === img.url"
                          class="w-24 h-18 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent transition-all hover:scale-105 shadow-sm">
                          <img [src]="img.url" class="w-full h-full object-cover">
                        </div>
                      }
                    </div>
                  }
                </div>
                <!-- Description -->
                <div class="bg-white rounded-3xl p-8 shadow-lg border border-peach/10 space-y-4">
                  <h1 class="text-3xl font-extrabold tracking-tight">{{ property.title }}</h1>
                  <div class="flex items-center gap-2 text-navy/60 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ property.address }}
                  </div>
                  <hr class="border-gray-100">
                  <div class="prose prose-navy max-w-none">
                    <h2 class="text-xl font-bold">Descriere</h2>
                    <p class="whitespace-pre-wrap leading-relaxed text-navy/80">{{ property.description }}</p>
                  </div>
                </div>
              </div>
              <!-- Right Column: Details & Contact -->
              <div class="space-y-8">
                <!-- Specs Card -->
                <div class="bg-white rounded-3xl p-8 shadow-lg border border-peach/10 space-y-6">
                  <h2 class="text-xl font-bold flex items-center gap-2">
                    <span class="w-1.5 h-6 bg-orange rounded-full"></span>
                    Specificații
                  </h2>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                      <span class="text-xs font-bold text-navy/40 uppercase tracking-widest">Camere</span>
                      <span class="text-xl font-extrabold text-navy">{{ property.bedrooms }}</span>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                      <span class="text-xs font-bold text-navy/40 uppercase tracking-widest">Băi</span>
                      <span class="text-xl font-extrabold text-navy">{{ property.bathrooms }}</span>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center col-span-2">
                      <span class="text-xs font-bold text-navy/40 uppercase tracking-widest">Suprafață utilă</span>
                      <span class="text-xl font-extrabold text-navy">{{ property.surfaceArea }} m²</span>
                    </div>
                  </div>
                </div>
                <!-- Contact/Action Card -->
                <div class="bg-navy rounded-3xl p-8 shadow-xl text-white space-y-6">
                  <h2 class="text-xl font-bold">Te interesează?</h2>
                  <p class="text-white/70 text-sm">Trimite un mesaj sau sună pentru mai multe detalii.</p>
                  <div class="space-y-3">
                    <button class="w-full h-14 bg-orange text-white rounded-xl font-bold hover:bg-orange/90 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Sunați acum
                    </button>
                    <button class="w-full h-14 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                      Trimite mesaj
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center h-96 space-y-4">
            <div class="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
            <p class="text-navy/60 font-medium">Se încarcă detaliile...</p>
          </div>
        }
    
        <!-- Loading State -->
      </main>
    
      <div class="h-2 bg-peach w-full mt-auto"></div>
    </div>
    `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PropertyDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);

  property?: Property;
  currentImage: string = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyService.getProperty(+id).subscribe({
        next: (data) => {
          this.property = data;
          if (this.property.images && this.property.images.length > 0) {
            this.currentImage = this.property.images[0].url;
          }
        },
        error: (err) => console.error('Error fetching property:', err)
      });
    }
  }
}
