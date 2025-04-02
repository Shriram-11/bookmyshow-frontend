import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ConfigService } from "./services/config.service";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  template: `
    <app-navigation></app-navigation>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
   constructor(public configService: ConfigService) {}
}
