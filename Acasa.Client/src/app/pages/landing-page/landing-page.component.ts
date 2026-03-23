import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Property, PropertyFilter } from '../../models/property.model';
import { City } from '../../models/city.model';
import { PropertyService } from '../../services/property.service';
import { CityService } from '../../services/city.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FormsModule, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private cityService = inject(CityService);

  filter: PropertyFilter = {
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    cityId: undefined
  };

  properties: Property[] = [];
  cities: City[] = [];

  ngOnInit() {
    this.loadCities();
    this.onSearch();
  }

  loadCities() {
    this.cityService.getCities().subscribe({
      next: (data) => this.cities = data,
      error: (err) => console.error('Error loading cities:', err)
    });
  }

  onSearch() {
    this.propertyService.getFilteredProperties(this.filter).subscribe({
      next: (results) => {
        this.properties = results;
        console.log('Filtered properties:', this.properties);
      },
      error: (error) => {
        console.error('Error fetching properties:', error);
      }
    });
  }
}
