import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";

import { MatStepperModule } from "@angular/material/stepper";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { BusinessService } from "../../core/services/business.service";
import { WhatsAppService, WhatsAppStatus } from "../../core/services/whatsapp.service";
import { CalendarService, CalendarConnectionStatus } from "../../core/services/calendar.service";

@Component({
  selector: "app-onboarding",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: "./onboarding.component.html",
  styles: [`
    .wrap { max-width: 900px; margin: 24px auto; padding: 0 12px; }
    mat-card { padding: 16px; }
    .row { display: grid; grid-template-columns: 1fr; gap: 12px; }
    @media (min-width: 800px) { .row { grid-template-columns: 1fr 1fr; } }
    .full { width: 100%; }
    .status { margin: 8px 0 16px; }
  `],
})
export class OnboardingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private businessApi = inject(BusinessService);
  private waApi = inject(WhatsAppService);
  private calApi = inject(CalendarService);

  businessForm = this.fb.group({
    businessName: ["", Validators.required],
    timezone: ["Asia/Jerusalem", Validators.required],
  });

  whatsappForm = this.fb.group({
    wabaId: ["", Validators.required],
    phoneNumberId: ["", Validators.required],
  });

  waStatus: WhatsAppStatus | null = null;
  calStatus: CalendarConnectionStatus | null = null;

  loadingBusiness = false;
  loadingWa = false;
  loadingGoogle = false;

  ngOnInit() {
    this.loadInitial();
  }

  loadInitial() {
    // best effort: load business + statuses
    this.businessApi.get().subscribe({
      next: (b) => {
        if (b?.businessName) this.businessForm.patchValue({ businessName: b.businessName });
        if (b?.timezone) this.businessForm.patchValue({ timezone: b.timezone });
      },
      error: () => {},
    });

    this.refreshStatuses();
  }

  refreshStatuses() {
    this.waApi.getStatus().subscribe({
      next: (s) => {
        this.waStatus = s;
        this.whatsappForm.patchValue({
          wabaId: s.wabaId ?? "",
          phoneNumberId: s.phoneNumberId ?? "",
        });
      },
      error: () => (this.waStatus = null),
    });

    this.calApi.getConnections().subscribe({
      next: (s) => (this.calStatus = s),
      error: () => (this.calStatus = null),
    });
  }

  saveBusiness() {
    if (this.businessForm.invalid || this.loadingBusiness) return;
    this.loadingBusiness = true;

    this.businessApi.update(this.businessForm.value as any).subscribe({
      next: () => {
        this.loadingBusiness = false;
        this.snack.open("Business saved", "Close", { duration: 2000 });
        this.refreshStatuses();
      },
      error: (err) => {
        this.loadingBusiness = false;
        this.snack.open(err?.error?.message ?? "Failed to save business", "Close", { duration: 3000 });
      },
    });
  }

  connectWhatsApp() {
    if (this.whatsappForm.invalid || this.loadingWa) return;
    this.loadingWa = true;

    const payload = {
      wabaId: String(this.whatsappForm.value.wabaId ?? ""),
      phoneNumberId: String(this.whatsappForm.value.phoneNumberId ?? ""),
    };

    this.waApi.connect(payload).subscribe({
      next: (s) => {
        this.loadingWa = false;
        this.waStatus = s;
        this.snack.open("WhatsApp saved", "Close", { duration: 2000 });
      },
      error: (err) => {
        this.loadingWa = false;
        this.snack.open(err?.error?.message ?? "Failed to save WhatsApp", "Close", { duration: 3000 });
      },
    });
  }

  connectGoogle() {
    if (this.loadingGoogle) return;
    this.loadingGoogle = true;

    this.calApi.getGoogleConnectUrl().subscribe({
      next: ({ url }) => {
        this.loadingGoogle = false;
        window.open(url, "_blank", "noopener,noreferrer");
      },
      error: () => {
        this.loadingGoogle = false;
        this.snack.open("Failed to get Google connect URL", "Close", { duration: 3000 });
      },
    });
  }
}
