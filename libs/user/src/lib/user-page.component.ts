import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-user-page',
  standalone: true,
  imports: [],
  template: `
    <p>user-page works!</p>
  `,
  styles: ``,
})
export class UserPageComponent {
  constructor(private store: Store) {}
}
