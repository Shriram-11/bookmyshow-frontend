import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="main-container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class LayoutComponent {}
