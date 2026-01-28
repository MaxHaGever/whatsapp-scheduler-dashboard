import { inject, PLATFORM_ID } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  // SSR: don't block or touch browser-only APIs
  if (!isPlatformBrowser(platformId)) return true;

  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigateByUrl("/login");
  return false;
};
