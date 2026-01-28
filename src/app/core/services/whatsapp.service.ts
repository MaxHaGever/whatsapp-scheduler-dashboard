import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export type WhatsAppStatus = {
  connected: boolean;
  wabaId: string | null;
  phoneNumberId: string | null;
};

@Injectable({ providedIn: "root" })
export class WhatsAppService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getStatus() {
    return this.http.get<WhatsAppStatus>(`${this.base}/api/whatsapp/status`);
  }

  connect(payload: { wabaId: string; phoneNumberId: string }) {
    return this.http.post<WhatsAppStatus>(`${this.base}/api/whatsapp/connect`, payload);
  }
}
