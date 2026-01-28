import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { MatCardModule } from "@angular/material/card";
import { MatStepperModule, MatStepper } from "@angular/material/stepper";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { BusinessService } from "../../core/services/business.service";
import { WhatsAppService } from "../../core/services/whatsapp.service";
import { CalendarService } from "../../core/services/calendar.service";

type GoogleConnectUrlResponse = { url: string };

@Component({
  selector: "app-onboarding",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.scss"],
})
export class OnboardingComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private businessService = inject(BusinessService);
  private whatsappService = inject(WhatsAppService);
  private calendarService = inject(CalendarService);

  savingBusiness = false;
  savingWhatsapp = false;
  loadingCalendar = false;

  calendarStatus: any = null;

  businessForm = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    timezone: ["Asia/Jerusalem", [Validators.required]],
  });

  whatsappForm = this.fb.group({
    wabaId: ["", [Validators.required]],
    phoneNumberId: ["", [Validators.required]],
    accessToken: ["", [Validators.required]],
  });

  ngOnInit() {
    this.refreshCalendarStatus();
  }

  saveBusinessAndNext(stepper: MatStepper) {
    if (this.businessForm.invalid) return;

    this.savingBusiness = true;
    const payload = {
      name: this.businessForm.value.name!,
      timezone: this.businessForm.value.timezone!,
    };

    this.businessService.updateBusiness(payload).subscribe({
      next: () => {
        this.savingBusiness = false;
        stepper.next();
      },
      error: (_err: unknown) => {
        this.savingBusiness = false;
        alert("Failed saving business");
      },
    });
  }

  saveWhatsappAndNext(stepper: MatStepper) {
    if (this.whatsappForm.invalid) return;

    this.savingWhatsapp = true;

    const payload = {
      wabaId: this.whatsappForm.value.wabaId!,
      phoneNumberId: this.whatsappForm.value.phoneNumberId!,
      accessToken: this.whatsappForm.value.accessToken!,
    };

    this.whatsappService.connect(payload).subscribe({
      next: () => {
        this.savingWhatsapp = false;
        stepper.next();
      },
      error: (_err: unknown) => {
        this.savingWhatsapp = false;
        alert("Failed saving WhatsApp settings");
      },
    });
  }

  connectGoogle() {
    this.loadingCalendar = true;

    this.calendarService.getConnectUrl().subscribe({
      next: (res: GoogleConnectUrlResponse) => {
        this.loadingCalendar = false;
        if (!res?.url) return alert("No connect URL returned");
        window.open(res.url, "_blank", "noopener,noreferrer");
      },
      error: (_err: unknown) => {
        this.loadingCalendar = false;
        alert("Failed getting Google connect URL");
      },
    });
  }

  refreshCalendarStatus() {
    this.loadingCalendar = true;

    this.calendarService.getConnections().subscribe({
      next: (s: any) => {
        this.calendarStatus = s;
        this.loadingCalendar = false;
      },
      error: (_err: unknown) => {
        this.loadingCalendar = false;
      },
    });
  }

  finish() {
    this.router.navigateByUrl("/");
  }
}
