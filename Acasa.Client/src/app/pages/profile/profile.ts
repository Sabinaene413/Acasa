import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-light-gray text-navy font-sans pt-[64px]">
      <app-navbar></app-navbar>

      <main class="flex-grow flex flex-col items-center py-12 px-4">
        <div class="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-peach/20 p-8 md:p-12">
          <div class="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-gray-100 pb-12">
            <div class="w-32 h-32 bg-orange/20 rounded-full flex items-center justify-center text-orange shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="text-center md:text-left space-y-2">
              <h1 class="text-3xl font-extrabold tracking-tight">Profilul Meu</h1>
              <p class="text-navy/60 font-medium">Bine ai venit înapoi pe Acasă!</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <h2 class="text-xl font-bold text-navy flex items-center gap-2">
                <span class="w-1.5 h-6 bg-orange rounded-full"></span>
                Informații Cont
              </h2>
              <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p class="text-xs font-bold text-navy/40 uppercase tracking-widest mb-1">Status Cont</p>
                  <p class="font-bold text-navy flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    Activ
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p class="text-xs font-bold text-navy/40 uppercase tracking-widest mb-1">Membru din</p>
                  <p class="font-bold text-navy">Martie 2026</p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <h2 class="text-xl font-bold text-navy flex items-center gap-2">
                <span class="w-1.5 h-6 bg-orange rounded-full"></span>
                Acțiuni Rapide
              </h2>
              <div class="grid grid-cols-1 gap-3">
                <button (click)="router.navigate(['/add-property'])" class="w-full h-14 bg-navy text-white rounded-xl font-bold hover:bg-orange transition-all flex items-center justify-center gap-2 shadow-md active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Adaugă un anunț nou
                </button>
                <button (click)="logout()" class="w-full h-14 border-2 border-navy text-navy rounded-xl font-bold hover:bg-navy hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Deconectare
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Bottom Accent -->
      <div class="h-2 bg-peach w-full mt-auto"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProfileComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
