import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CityService } from '../../../services/city.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { City } from '../../../models/city.model';
import { Property, PropertyImage } from '../../../models/property.model';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './edit-property.component.html',
})
export class EditPropertyComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private cityService = inject(CityService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  private destroy$ = new Subject<void>();

  propertyForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    price: [0, [Validators.required, Validators.min(1)]],
    address: ['', [Validators.required]],
    cityId: ['', [Validators.required]],
    bedrooms: [0, [Validators.required, Validators.min(0)]],
    bathrooms: [0, [Validators.required, Validators.min(0)]],
    surfaceArea: [0, [Validators.required, Validators.min(1)]],
  });

  propertyId?: number;
  cities = signal<City[]>([]);
  existingImages = signal<PropertyImage[]>([]);
  newFiles = signal<File[]>([]);
  newPreviews = signal<string[]>([]);
  imagesToDelete= signal<number[]>([]);
  isSubmitting = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadCities();
    this.loadProperty();
  }

  private loadCities() {
    this.cityService.getCities()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => { 
        this.cities.set(data)
       },
      error: (err) => console.error('Error loading cities:', err)
    });
  }

  private loadProperty() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyId = +id;
      this.propertyService.getProperty(this.propertyId).subscribe({
        next: (property) => {
          this.propertyForm.patchValue({
            title: property.title,
            description: property.description,
            price: property.price,
            address: property.address,
            cityId: property.city?.id,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            surfaceArea: property.surfaceArea,
          });
          this.existingImages.set(property.images || []);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading property:', err);
          this.toastService.error('Eroare', 'Nu s-a putut încărca proprietatea.');
          this.router.navigate(['/contul-meu']);
        }
      });
    }
  }

  onFileChange(event: any) {
    const files = Array.from(event.target.files as FileList);
    if (files.length > 0) {
      this.newFiles.update(current => [...current, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.newPreviews.update(current => [...current, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeExistingImage(imageId: number) {
    this.imagesToDelete.update(current => [...current, imageId]);
    this.existingImages.update(current => current.filter(img => img.id !== imageId));
  }

  removeNewImage(index: number) {
    this.newFiles.update(current => current.filter((_, i) => i !== index));
    this.newPreviews.update(current => current.filter((_, i) => i !== index));
  }

  onSubmit() {
    if(this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    if(!this.propertyId) return;

    this.isSubmitting.set(true);
    const formData = new FormData();

    const value = this.propertyForm.getRawValue();

    Object.entries(value).forEach(([key, val]) => {
      formData.append(key, String(val));
    });

    this.newFiles().forEach(file => {
      formData.append('newImages', file);
    });

    this.imagesToDelete().forEach(id => {
      formData.append('imagesToDelete', String(id));
    });

    this.propertyService.updateProperty(this.propertyId, formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toastService.success('Succes', 'Anuntul a fost actualizat!');
        this.router.navigate(['/contul-meu']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toastService.error('Eroare', 'A aparut o eroare');
      }
    });
  }

    ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();
  }
}


