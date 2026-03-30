import { Component, inject, signal, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CityService } from '../../../services/city.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { City } from '../../../models/city.model';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './add-property.component.html',
})
export class AddPropertyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private cityService = inject(CityService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  propertyForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    price: [0, [Validators.required, Validators.min(1)]],
    address: ['', [Validators.required]],
    cityId: ['', [Validators.required]],
    bedrooms: [0, [Validators.required, Validators.min(0)]],
    bathrooms: [0, [Validators.required, Validators.min(0)]],
    surfaceArea: [0, [Validators.required, Validators.min(1)]],
    latitude: [null, [Validators.min(-90), Validators.max(90)]],
    longitude: [null, [Validators.min(-180), Validators.max(180)]],
  });

  isInvalid(controlName: string) {
    const control = this.propertyForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  cities = signal<City[]>([]);
  selectedFiles = signal<File[]>([]);
  previews = signal<string[]>([]);
  isSubmitting = signal<boolean>(false);

  ngOnInit() {
    this.cityService.getCities().subscribe({
      next: (data) => this.cities.set(data),
      error: (err) => console.error('Error loading cities:', err)
    });
  }

  onFileChange(event: any) {
    const files = Array.from(event.target.files as FileList);
    if (files.length > 0) {
      this.selectedFiles.update(current => [...current, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.update(current => [...current, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.selectedFiles.update(current => current.filter((_, i) => i !== index));
    this.previews.update(current => current.filter((_, i) => i !== index));
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      this.isSubmitting.set(true);
      const formData = new FormData();
      
      Object.keys(this.propertyForm.value).forEach(key => {
        formData.append(key, this.propertyForm.value[key]);
      });

      this.selectedFiles().forEach(file => {
        formData.append('images', file);
      });

      this.propertyService.createProperty(formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.toastService.success('Succes', 'Anunțul a fost adăugat cu succes!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.toastService.error('Eroare', 'A apărut o eroare la salvarea anunțului.');
        }
      });
    }
  }
}
