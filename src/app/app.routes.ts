import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { LoginComponent } from "./features/auth/login.component";
import { OnboardingComponent } from "./features/onboarding/onboarding.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },

  { path: "onboarding", component: OnboardingComponent, canActivate: [authGuard] },

  { path: "", redirectTo: "onboarding", pathMatch: "full" },
  { path: "**", redirectTo: "onboarding" },
];
