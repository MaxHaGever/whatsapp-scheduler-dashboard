import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { BusinessService } from "../../core/services/business.service";
import { CalendarService, CalendarStatus } from "../../core/services/calendar.service";

@Component({
  selector: "app-onboarding",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.scss"],
})
export class OnboardingComponent {
  businessForm!: FormGroup;
  whatsappForm!: FormGroup;

  calendarStatus: CalendarStatus | null = null;

  savingBusiness = false;
  savingWhatsapp = false;
  loadingCalendar = false;

  constructor(
    private fb: FormBuilder,
    private business: BusinessService,
    private calendar: CalendarService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.businessForm = this.fb.group({
      name: ["", [Validators.required]],
      timezone: ["Asia/Jerusalem", [Validators.required]],
    });

    this.whatsappForm = this.fb.group({
      wabaId: ["", [Validators.required]],
      phoneNumberId: ["", [Validators.required]],
    });

    // load calendar status stream
    this.loadingCalendar = true;
    this.calendar.status.subscribe({
      next: (s: CalendarStatus) => {
        this.calendarStatus = s;
        this.loadingCalendar = false;
      },
      error: () => {
        this.loadingCalendar = false;
      },
    });
  }

  saveBusinessAndNext(stepper: any) {
    if (this.businessForm.invalid) {
      this.snack.open("Fill business name + timezone", "OK", { duration: 2500 });
      return;
    }
    this.savingBusiness = true;

    this.business.updateBusiness(this.businessForm.value).subscribe({
      next: () => {
        this.savingBusiness = false;
        this.snack.open("Business saved", "OK", { duration: 1500 });
        stepper.next();
      },
      error: (err: unknown) => {
        this.savingBusiness = false;
        this.snack.open("Failed saving business", "OK", { duration: 2500 });
        console.error(err);
      },
    });
  }

  saveWhatsappAndNext(stepper: any) {
    if (this.whatsappForm.invalid) {
      this.snack.open("Fill WhatsApp WABA ID + Phone Number ID", "OK", { duration: 2500 });
      return;
    }
    this.savingWhatsapp = true;

    // backend endpoint you already have: POST /api/whatsapp/connect
    // we call it via BusinessService? no — simplest is direct call with HttpClient,
    // but keeping minimal changes: use fetch via CalendarService? no.
    // So for now: reuse BusinessService updateBusiness to store it in business model
    // (if your backend stores WhatsApp data elsewhere, replace this call with WhatsAppService).
    const payload = {
      wabaId: this.whatsappForm.value.wabaId,
      phoneNumberId: this.whatsappForm.value.phoneNumberId,
    };

    this.business.updateBusiness(payload).subscribe({
      next: () => {
        this.savingWhatsapp = false;
        this.snack.open("WhatsApp saved", "OK", { duration: 1500 });
        stepper.next();
      },
      error: (err: any) => {
        this.savingWhatsapp = false;
        // duplicate key / already used phoneNumberId, etc.
        const msg = err?.error?.message ?? "Failed saving WhatsApp settings";
        this.snack.open(msg, "OK", { duration: 3000 });
        console.error(err);
      },
    });
  }

  connectGoogle() {
    this.calendar.getConnectUrl().subscribe({
      next: ({ url }) => {
        // open Google consent in a new tab
        window.open(url, "_blank");
        this.snack.open("Complete Google consent, then come back — we’ll refresh.", "OK", {
          duration: 3500,
        });
      },
      error: (err) => {
        this.snack.open("Failed to start Google connect", "OK", { duration: 2500 });
        console.error(err);
      },
    });
  }

  refreshCalendarStatus() {
    this.calendar.refresh();
  }

  finish() {
    this.router.navigateByUrl("/dashboard");
  }
}
