import { Component } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="wrap">
      <mat-card class="card">
        <h2>Login</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" autocomplete="email" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" autocomplete="current-password" />
          </mat-form-field>

          <button mat-raised-button color="primary" class="full" [disabled]="form.invalid || loading">
            {{ loading ? "Logging in..." : "Login" }}
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .wrap { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { width: 420px; padding: 16px; }
    .full { width: 100%; }
    h2 { margin: 0 0 12px; }
  `],
})
export class LoginComponent {
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    const email = String(this.form.value.email ?? "");
    const password = String(this.form.value.password ?? "");

    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl("/dashboard");
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message ?? "Login failed";
        this.snack.open(msg, "Close", { duration: 3000 });
      },
    });
  }
}
