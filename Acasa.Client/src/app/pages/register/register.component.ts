import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  registerGroup(controlName: string) {
    return this.registerForm.get(controlName)!;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Create a clean payload (without confirmPassword)
      const { name, email, password } = this.registerForm.value;
      this.authService.register({ name, email, password }).subscribe({
        next: (response) => {
          console.log('Înregistrare reușită!', response);
          alert('Contul tău a fost creat cu succes!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Eroare la înregistrare', err);
          alert('A apărut o eroare la crearea contului.');
        },
      });
    }
  }
}
