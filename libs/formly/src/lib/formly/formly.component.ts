import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'expense-tracker-ui-formly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formly.component.html',
  styleUrl: './formly.component.css',
})
export class FormlyComponent {}
