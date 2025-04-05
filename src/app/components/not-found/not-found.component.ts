import {Component} from "@angular/core";
import { Router } from "@angular/router";
import {CommonModule} from "@angular/common";
import {ConfigService} from "../../services/config.service";
@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./not-found.component.html",
  styleUrls: ["not-found.component.scss"],
})
export class NotFoundComponent{
  constructor(private readonly router: Router, public configService: ConfigService) {
  }
  goHome() {
    this.router.navigate(["/"]);
  }
}
