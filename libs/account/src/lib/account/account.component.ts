import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-account',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>account works!</p>
  `,
  styles: ``,
})
export class AccountComponent {}
