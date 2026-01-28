import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <h2>Dashboard</h2>
      <p>You’re logged in. Next we’ll add onboarding + WhatsApp/Calendar status.</p>
    </mat-card>
  `,
})
export class DashboardComponent {}
