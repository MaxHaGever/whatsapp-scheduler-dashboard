import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export type WhatsAppStatus = {
  connected: boolean;
  wabaId: string | null;
  phoneNumberId: string | null;
  updatedAt: string | null;
};

@Injectable({ providedIn: "root" })
export class WhatsAppService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  status() {
    return this.http.get<WhatsAppStatus>(`${this.base}/api/whatsapp/status`);
  }

  connect(payload: { wabaId: string; phoneNumberId: string; accessToken: string }) {
    return this.http.post<WhatsAppStatus>(`${this.base}/api/whatsapp/connect`, payload);
  }

  testMessage(payload: { to: string; text: string }) {
    return this.http.post(`${this.base}/api/whatsapp/test-message`, payload);
  }
}
