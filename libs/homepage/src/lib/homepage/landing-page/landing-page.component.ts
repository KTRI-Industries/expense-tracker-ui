import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'expense-tracker-ui-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    RouterLink,
    NgOptimizedImage,
    MatCard,
    MatIcon,
  ],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
  @Output() login = new EventEmitter<void>();
}
