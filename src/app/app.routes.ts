import { Routes } from "@angular/router";
import { LoginComponent } from "./features/auth/login.component";
import { OnboardingComponent } from "./features/onboarding/onboarding.component";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  { path: "login", component: LoginComponent },

  { path: "onboarding", component: OnboardingComponent, canActivate: [authGuard] },

  { path: "", redirectTo: "onboarding", pathMatch: "full" },
  { path: "**", redirectTo: "onboarding" },
];
