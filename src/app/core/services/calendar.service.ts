import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export type CalendarConnectionStatus = {
  provider: "google";
  connected: boolean;
  calendarId: string;
  timezone: string;
  updatedAt: string | null;
};

@Injectable({ providedIn: "root" })
export class CalendarService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getConnections() {
    return this.http.get<CalendarConnectionStatus>(`${this.base}/api/calendar/connections`);
  }

  getGoogleConnectUrl() {
    return this.http.get<{ url: string }>(`${this.base}/api/calendar/google/connect-url`);
  }
}
