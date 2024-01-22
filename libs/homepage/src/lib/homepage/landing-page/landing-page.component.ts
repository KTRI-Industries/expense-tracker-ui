import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'expense-tracker-ui-landing-page',
  standalone: true,
  imports: [CommonModule, MatButton, RouterLink, NgOptimizedImage],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  @Output() login = new EventEmitter<void>();
}
