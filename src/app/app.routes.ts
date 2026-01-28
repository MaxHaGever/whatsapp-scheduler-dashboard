import { Routes } from "@angular/router";
import { LoginComponent } from "./features/auth/login.component";
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { LayoutComponent } from "./layout/layout.component";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  { path: "login", component: LoginComponent },

  {
    path: "",
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
    ],
  },

  { path: "**", redirectTo: "dashboard" },
];
