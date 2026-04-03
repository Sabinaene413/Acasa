import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService } from '../services/property.service';
import { Property } from '../models/property.model';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <div
      class="min-h-screen bg-light-gray text-navy font-sans pt-[64px] flex flex-col"
    >
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
              <!-- Coloana Stângă -->
              <div class="lg:col-span-2 space-y-8">
                <!-- Image Gallery -->
                <div
                  class="bg-white rounded-3xl overflow-hidden shadow-xl border border-peach/10"
                >
                  <div class="relative aspect-video">
                    <img
                      [src]="currentImage"
                      class="w-full h-full object-cover"
                      [alt]="property.title"
                    />
                    <div
                      class="absolute top-4 left-4 bg-orange text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg"
                    >
                      {{
                        property.price | currency: 'EUR' : 'symbol' : '1.0-0'
                      }}
                    </div>
                  </div>
                  @if (property.images && property.images.length > 1) {
                    <div class="p-4 flex gap-4 overflow-x-auto">
                      @for (img of property.images; track img) {
                        <div
                          (click)="currentImage = img.url"
                          [class.border-orange]="currentImage === img.url"
                          class="w-24 h-18 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent transition-all hover:scale-105 shadow-sm"
                        >
                          <img
                            [src]="img.url"
                            class="w-full h-full object-cover"
                          />
                        </div>
                      }
                    </div>
                  }
                </div>

                <!-- Description -->
                <div
                  class="bg-white rounded-3xl p-8 shadow-lg border border-peach/10 space-y-4"
                >
                  <h1 class="text-3xl font-extrabold tracking-tight">
                    {{ property.title }}
                  </h1>
                  <div class="flex items-center gap-2 text-navy/60 font-medium">
                    <i class="pi pi-map-marker text-orange"></i>
                    {{ property.address }}
                  </div>
                  <hr class="border-gray-100" />
                  <div class="prose prose-navy max-w-none">
                    <h2 class="text-xl font-bold">Descriere</h2>
                    <p class="whitespace-pre-wrap leading-relaxed text-navy/80">
                      {{ property.description }}
                    </p>
                  </div>
                </div>

                <!-- Harta -->
                @if (property.latitude && property.longitude) {
                  <div
                    class="bg-white rounded-3xl overflow-hidden shadow-lg border border-peach/10"
                  >
                    <div class="px-8 pt-8 pb-4">
                      <h2 class="text-xl font-bold flex items-center gap-2">
                        <span class="w-1.5 h-6 bg-orange rounded-full"></span>
                        Locație
                      </h2>
                    </div>
                    <div id="propertyMap"  class="w-full h-72"></div>
                  </div>
                }
              </div>

              <!-- Coloana Dreaptă -->
              <div class="space-y-8">
                <!-- Specs Card -->
                <div
                  class="bg-white rounded-3xl p-8 shadow-lg border border-peach/10 space-y-6"
                >
                  <h2 class="text-xl font-bold flex items-center gap-2">
                    <span class="w-1.5 h-6 bg-orange rounded-full"></span>
                    Specificații
                  </h2>
                  <div class="grid grid-cols-2 gap-4">
                    <div
                      class="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center"
                    >
                      <span
                        class="text-xs font-bold text-navy/40 uppercase tracking-widest"
                        >Camere</span
                      >
                      <span class="text-xl font-extrabold text-navy">{{
                        property.bedrooms
                      }}</span>
                    </div>
                    <div
                      class="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center"
                    >
                      <span
                        class="text-xs font-bold text-navy/40 uppercase tracking-widest"
                        >Băi</span
                      >
                      <span class="text-xl font-extrabold text-navy">{{
                        property.bathrooms
                      }}</span>
                    </div>
                    <div
                      class="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center col-span-2"
                    >
                      <span
                        class="text-xs font-bold text-navy/40 uppercase tracking-widest"
                        >Suprafață utilă</span
                      >
                      <span class="text-xl font-extrabold text-navy"
                        >{{ property.surfaceArea }} m²</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Contact Card -->
                <div
                  class="bg-navy rounded-3xl p-8 shadow-xl text-white space-y-6"
                >
                  <h2 class="text-xl font-bold">Te interesează?</h2>
                  <p class="text-white/70 text-sm">
                    Trimite un mesaj sau sună pentru mai multe detalii.
                  </p>
                  <div class="space-y-3">
                    <button
                      class="w-full h-14 bg-orange text-white rounded-xl font-bold hover:bg-orange/90 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg"
                    >
                      <i class="pi pi-phone"></i>
                      Sunați acum
                    </button>
                    <button
                      class="w-full h-14 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      Trimite mesaj
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center h-96 space-y-4">
            <div
              class="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"
            ></div>
            <p class="text-navy/60 font-medium">Se încarcă detaliile...</p>
          </div>
        }
      </main>

      <div class="h-2 bg-peach w-full mt-auto"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PropertyDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);


  property?: Property;
  currentImage: string = '';
  private map?: L.Map;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyService.getProperty(+id).subscribe({
        next: (data) => {
          this.property = data;
          if (this.property.images && this.property.images.length > 0) {
            this.currentImage = this.property.images[0].url;
          }
          if (this.property.latitude && this.property.longitude) {
            setTimeout(() => this.initMap(), 100);
          }
        },
        error: (err) => console.error('Error fetching property:', err),
      });
    }
  }

  ngAfterViewInit() {}

  private initMap() {
    const container = document.getElementById('propertyMap');
    if (!container) return;

    const iconRetinaUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
    const iconUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
    const shadowUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const lat = this.property!.latitude!;
    const lng = this.property!.longitude!;

    this.map = L.map(container, {
      zoomControl: true,
      scrollWheelZoom: false, // mai plăcut pe pagini de detaliu
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(this.map);

    L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(this.property!.address)
      .openPopup();
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
