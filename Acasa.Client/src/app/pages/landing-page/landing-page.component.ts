import { Component, OnInit, inject, signal } from '@angular/core';
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
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private cityService = inject(CityService);

  filter: PropertyFilter = {
    minPrice: 0,
    maxPrice: 1000000,
    minSurfaceArea: 0,
    maxSurfaceArea: 500,
    bedrooms: undefined,
    bathrooms: undefined,
    cityId: undefined,
    countyId: undefined,
  };

  inputs = {
    price: { lo: '', hi: '' },
    surface: { lo: '', hi: '' },
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
  isLoading = signal(false);

  ngOnInit() {
    this.loadCounties();
    this.loadCities();
    this.onSearch();
    this.syncInputsFromSlider('price');
    this.syncInputsFromSlider('surface');
  }

  onPriceRangeChange() {
    this.filter.minPrice = this.rangeValues[0];
    this.filter.maxPrice =
      this.rangeValues[1] === this.maxPriceLimit
        ? 999999999
        : this.rangeValues[1];
    this.syncInputsFromSlider('price');
  }

  onSurfaceRangeChange() {
    this.filter.minSurfaceArea = this.surfaceRangeValues[0];
    this.filter.maxSurfaceArea =
      this.surfaceRangeValues[1] === this.maxSurfaceLimit
        ? 999999999
        : this.surfaceRangeValues[1];
    this.syncInputsFromSlider('surface');
  }

  onInputChange(range: 'price' | 'surface', which: 'lo' | 'hi') {
    const raw = this.inputs[range][which];
    const parsed = parseInt(raw.replace(/\D/g, ''), 10);

    const config = {
      price: { min: this.minPriceLimit, max: this.maxPriceLimit, step: 1000 },
      surface: {
        min: this.minSurfaceLimit,
        max: this.maxSurfaceLimit,
        step: 1,
      },
    };
    const { min, max, step } = config[range];

    if (isNaN(parsed)) {
      this.syncInputsFromSlider(range);
      return;
    }

    const snapped =
      Math.round(Math.max(min, Math.min(max, parsed)) / step) * step;
    const values =
      range === 'price' ? this.rangeValues : this.surfaceRangeValues;
    const updated: [number, number] =
      which === 'lo'
        ? [Math.min(snapped, values[1] - step), values[1]]
        : [values[0], Math.max(snapped, values[0] + step)];

    if (range === 'price') {
      this.rangeValues = updated;
      this.onPriceRangeChange();
    } else {
      this.surfaceRangeValues = updated;
      this.onSurfaceRangeChange();
    }
  }

  private syncInputsFromSlider(range: 'price' | 'surface') {
    const values =
      range === 'price' ? this.rangeValues : this.surfaceRangeValues;
    const max = range === 'price' ? this.maxPriceLimit : this.maxSurfaceLimit;

    this.inputs[range].lo = this.formatValue(values[0], range);
    this.inputs[range].hi = this.formatValue(
      values[1],
      range,
      values[1] >= max,
    );
  }

  private formatValue(
    v: number,
    range: 'price' | 'surface',
    isMax = false,
  ): string {
    const suffix = isMax ? '+' : '';
    if (range === 'price') return v.toLocaleString('ro-RO') + ' €' + suffix;
    return v + ' m²' + suffix;
  }

  loadCounties() {
    this.cityService.getCounties().subscribe({
      next: (data) => (this.counties = data),
      error: (err) => console.error('Error loading counties:', err),
    });
  }

  loadCities(countyId?: number) {
    this.cities = [];
    if (countyId) {
      this.cityService.getCitiesByCounty(countyId).subscribe({
        next: (data) => (this.cities = data),
        error: (err) => console.error('Error loading cities by county:', err),
      });
    } else {
      this.cityService.getCities().subscribe({
        next: (data) => (this.cities = data),
        error: (err) => console.error('Error loading cities:', err),
      });
    }
  }

  onCountyChange() {
    this.filter.cityId = undefined; // Reset city when county changes
    this.loadCities(this.filter.countyId);
  }

  onSearch() {
    this.isLoading.set(true);
    this.propertyService.getFilteredProperties(this.filter).subscribe({
      next: (results) => {
        this.properties = results;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching properties:', error);
        this.isLoading.set(false);
      },
    });
  }
}
