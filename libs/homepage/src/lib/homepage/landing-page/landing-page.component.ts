import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'expense-tracker-ui-landing-page',
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
  @Output() login = new EventEmitter<void>();
}
