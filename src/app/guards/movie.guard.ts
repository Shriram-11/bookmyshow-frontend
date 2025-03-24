import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from "@angular/core";

export const MovieGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getCurrentAuthStatus()) {
    return true;
  } else {
    router.navigate(['movie-list']);
    return false;
  }
};
