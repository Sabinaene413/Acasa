import {
  Component,
  OnInit,
  inject,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { PropertyService } from '../../../services/property.service';
import { Property } from '../../../models/property.model';
import * as L from 'leaflet';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-properties-map',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: 'properties-map.component.html',
  styleUrl: 'properties-map.component.scss',
})
export class PropertiesMapComponent implements OnInit, AfterViewInit {
  private propertyService = inject(PropertyService);
  private router = inject(Router);
  private map?: L.Map;
  private markers: L.Marker[] = [];

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  properties = signal<Property[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadProperties();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private loadProperties() {
    this.propertyService.getProperties().subscribe({
      next: (data) => {
        this.properties.set(data);
        if (this.map) this.addMarkersToMap();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading properties', err);
        this.isLoading.set(false);
      },
    });
  }

  private initMap() {
    const iconRetinaUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
    const iconUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
    const shadowUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [45.9432, 24.9668],
      7,
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    // Event delegation for popup links
    this.mapContainer.nativeElement.addEventListener(
      'click',
      (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'A' && target.getAttribute('data-property-id')) {
          event.preventDefault();
          const id = target.getAttribute('data-property-id');
          this.router.navigate(['/property', id]);
        }
      },
    );

    if (this.properties().length > 0) {
      this.addMarkersToMap();
    }
  }

  private addMarkersToMap() {
    if (!this.map) return;
    this.markers.forEach((m) => m.remove());
    this.markers = [];

    this.properties().forEach((property) => {
      if (property.latitude && property.longitude) {
        const priceIcon = L.divIcon({
          className: '',
          html: `
            <div class="price-marker">
              ${new Intl.NumberFormat('de-DE').format(property.price)} €
             </div>
          `,
          iconSize: undefined,
          iconAnchor: [0, 0],
        });

        const marker = L.marker([property.latitude, property.longitude], {
          icon: priceIcon,
        })
          .addTo(this.map!)
          .bindPopup(this.createPopupHtml(property), {
            offset: L.point(0, -30),
          });
        this.markers.push(marker);
      }
    });

    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private createPopupHtml(property: Property): string {
    const imageUrl =
      property.images && property.images.length > 0
        ? property.images[0].url
        : 'assets/placeholder-property.jpg';

    return `
      <div class="w-48 p-0 overflow-hidden rounded-lg">
        <img src="${imageUrl}" class="w-full h-32 object-cover" alt="${property.title}">
        <div class="p-2">
          <h3 class="font-bold text-sm text-navy truncate">${property.title}</h3>
          <p class="text-orange font-bold text-sm">${property.price} €</p>
          <a href="/property/${property.id}" data-property-id="${property.id}" class="mt-2 block w-full text-center py-1 bg-navy text-white text-xs rounded hover:bg-orange transition-colors">
            Detalii
          </a>
        </div>
      </div>
    `;
  }
}
