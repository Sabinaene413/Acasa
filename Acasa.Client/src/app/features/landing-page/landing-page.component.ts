import { Component, inject, signal, ViewChild } from "@angular/core";
import { PropertySearchFormComponent } from "./components/property-search-form/property-search-form.component";
import { NavbarComponent } from "../../core/components/navbar/navbar.component";
import { PropertyResultsGridComponent } from "./components/property-results-grid/property-results-grid.component";
import { PropertyFilter, Property, DEFAULT_FILTER } from "../properties/models/property.model";
import { SavedSearch } from "../properties/models/saved-search.model";
import { PropertyService } from "../properties/services/property.service";
import { SaveSearchModalComponent } from "./components/save-search-modal/save-search-modal.component";
import { SavedSearchesBarComponent } from "./components/saved-searches-bar/saved-searches-bar.component";

@Component({
  standalone: true,
  imports: [
    NavbarComponent,
    PropertySearchFormComponent,
    PropertyResultsGridComponent,
    SavedSearchesBarComponent,
    SaveSearchModalComponent,
  ],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
  private propertyService = inject(PropertyService);

  @ViewChild(SavedSearchesBarComponent)
  savedSearchesBar!: SavedSearchesBarComponent;

  showSaveModal = signal(false);
  currentFilter = signal<PropertyFilter>(DEFAULT_FILTER);
  properties = signal<Property[]>([]);
  isLoading = signal(false);

  constructor() {
    this.onSearch(DEFAULT_FILTER); 
  }

  onSearch(filter: PropertyFilter) {
    this.currentFilter.set(filter);
    this.isLoading.set(true);

    this.propertyService.getFilteredProperties(filter).subscribe({
      next: (results) => {
        this.properties.set(results);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onSearchSaved(search: SavedSearch) {
    this.savedSearchesBar.addSearch(search); // adaugă în listă fără re-fetch
    this.showSaveModal.set(false);
  }
}