import { Component, ElementRef, ViewChild, AfterViewInit, input, effect, inject, signal } from '@angular/core';
import { Property } from '../../../models/property.model';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-property-map-ui',
  standalone: true,
  template: `<div #mapContainer class="absolute inset-0 z-0"></div>`,
  styles: [`
    :host { display: block; height: 100%; width: 100%; }
    ::ng-deep {
      .price-marker {
        background: white; border: 2px solid #ed985f; border-radius: 8px;
        padding: 2px 8px; font-weight: 700; color: #001f3d; font-size: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); white-space: nowrap;
        cursor: pointer; transition: all 0.2s ease-in-out;
      }
      .price-marker:hover { background: #ed985f; color: white; transform: scale(1.1); z-index: 1000 !important; }
      .custom-cluster {
        width: 40px; height: 40px; border-radius: 50%; background-color: #ed985f;
        color: white; font-weight: 700; font-size: 13px; display: flex;
        align-items: center; justify-content: center; border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      .leaflet-popup-content-wrapper { border-radius: 12px; padding: 0; overflow: hidden; }
      .leaflet-popup-content { margin: 0; width: auto !important; }
    }
  `],
})
export class PropertyMapComponent implements AfterViewInit {
  private router = inject(Router);
  private mapInstance = signal<L.Map | undefined>(undefined);
  private markersCluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 60,
    spiderfyOnMaxZoom: true,
    iconCreateFunction: (cluster) => L.divIcon({
      html: `<div class="custom-cluster">${cluster.getChildCount()}</div>`,
      className: '', iconSize: [40, 40], iconAnchor: [20, 20]
    }),
  });

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  properties = input<Property[]>([]);

  constructor() {
    // Acest effect va rula ori de câte ori 'properties' SAU 'mapInstance' se schimbă
    effect(() => {
      const props = this.properties();
      const map = this.mapInstance();
      
      if (map) {
        console.log(`Updating map with ${props.length} properties`);
        this.updateMarkers(map, props);
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  public resizeMap() {
    setTimeout(() => {
      const map = this.mapInstance();
      if (map) {
        map.invalidateSize({ animate: true });
      }
    }, 300);
  }

  private initMap() {
    const map = L.map(this.mapContainer.nativeElement, { 
      maxZoom: 18,
      zoomControl: false 
    }).setView([45.9432, 24.9668], 7);

    L.control.zoom({ position: 'topright' }).addTo(map);
    map.addLayer(this.markersCluster);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    this.mapContainer.nativeElement.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('data-property-id')) {
        event.preventDefault();
        const id = target.getAttribute('data-property-id');
        this.router.navigate(['/property', id]);
      }
    });

    // Setăm instanța hărții în semnal pentru a declanșa effect-ul
    this.mapInstance.set(map);
  }

  private updateMarkers(map: L.Map, properties: Property[]) {
    // Curățăm markerii existenți
    this.markersCluster.clearLayers();

    if (!properties || properties.length === 0) return;

    const newMarkers: L.Marker[] = [];

    properties.forEach((property) => {
      if (property.latitude && property.longitude) {
        const marker = L.marker([property.latitude, property.longitude], {
          icon: L.divIcon({
            className: '',
            html: `<div class="price-marker">${new Intl.NumberFormat('de-DE').format(property.price)} €</div>`,
            iconSize: [80, 30], // Dimensiune aproximativă pentru a evita erorile de randare
            iconAnchor: [40, 15],
          })
        }).bindPopup(this.createPopupHtml(property), {
          offset: L.point(0, -15),
        });

        newMarkers.push(marker);
      }
    });

    if (newMarkers.length > 0) {
      this.markersCluster.addLayers(newMarkers);
      
      try {
        const bounds = this.markersCluster.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds.pad(0.1), { animate: true });
        }
      } catch (e) {
        console.warn('Could not fit bounds', e);
      }
    }
  }

  private createPopupHtml(property: Property): string {
    const imageUrl = property.images?.[0]?.url || 'assets/placeholder-property.jpg';
    return `
      <div class="w-48 p-0 overflow-hidden rounded-lg">
        <img src="${imageUrl}" class="w-full h-32 object-cover">
        <div class="p-2">
          <h3 class="font-bold text-sm text-navy truncate">${property.title}</h3>
          <p class="text-orange font-bold text-sm">${property.price} €</p>
          <a href="javascript:void(0)" data-property-id="${property.id}" class="mt-2 block w-full text-center py-1 bg-navy text-white text-xs rounded hover:bg-orange transition-colors">
            Detalii
          </a>
        </div>
      </div>
    `;
  }
}
