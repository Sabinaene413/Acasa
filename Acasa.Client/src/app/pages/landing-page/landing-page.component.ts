import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Property, PropertyFilter } from '../../models/property.model';
import { City } from '../../models/city.model';
import { County } from '../../models/county.model';
import { PropertyService } from '../../services/property.service';
import { CityService } from '../../services/city.service';
import { CommonModule } from '@angular/common';
import { Slider } from 'primeng/slider';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FormsModule, CommonModule, Slider],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private cityService = inject(CityService);

  filter: PropertyFilter = {
    minPrice: 0,
    maxPrice: 1000000,
    minSurfaceArea: undefined,
    maxSurfaceArea: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    cityId: undefined,
    countyId: undefined
  };


  minPriceLimit = 0;
  maxPriceLimit = 1000000;
  rangeValues: number[] = [0, 1000000];

  minSurfaceLimit = 0;
  maxSurfaceLimit = 500;
  surfaceRangeValues: number[] = [0, 500];

  properties: Property[] = [];
  cities: City[] = [];
  counties: County[] = [];

  ngOnInit() {
    this.loadCounties();
    this.loadCities();
    this.onSearch();
  }

  onPriceRangeChange() {
    this.filter.minPrice = this.rangeValues[0];
    this.filter.maxPrice = this.rangeValues[1];
  }

  onSurfaceRangeChange() {
    this.filter.minSurfaceArea = this.surfaceRangeValues[0];
    this.filter.maxSurfaceArea = this.surfaceRangeValues[1];
  }

  loadCounties() {
    this.cityService.getCounties().subscribe({
      next: (data) => this.counties = data,
      error: (err) => console.error('Error loading counties:', err)
    });
  }

  loadCities(countyId?: number) {
    if (countyId) {
      this.cityService.getCitiesByCounty(countyId).subscribe({
        next: (data) => this.cities = data,
        error: (err) => console.error('Error loading cities by county:', err)
      });
    } else {
      this.cityService.getCities().subscribe({
        next: (data) => this.cities = data,
        error: (err) => console.error('Error loading cities:', err)
      });
    }
  }

  onCountyChange() {
    this.filter.cityId = undefined; // Reset city when county changes
    this.loadCities(this.filter.countyId);
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
