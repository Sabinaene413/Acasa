import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Property, PropertyFilter } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FormsModule, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  filter: PropertyFilter = {
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined
  };

  properties: Property[] = [];

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.onSearch();
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
