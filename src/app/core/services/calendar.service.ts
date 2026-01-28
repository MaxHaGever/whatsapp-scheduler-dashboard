import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { shareReplay, startWith, switchMap } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export type CalendarStatus = {
  provider: "google";
  connected: boolean;
  calendarId: string;
  timezone?: string;
  connectedEmail?: string | null;
  updatedAt?: string | null;
};

@Injectable({ providedIn: "root" })
export class CalendarService {
  private api = environment.apiBaseUrl;
  private refresh$ = new Subject<void>();

  // Onboarding expects `calendar.status`
  status: Observable<CalendarStatus> = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => this.getConnections()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private http: HttpClient) {}

  getConnections(): Observable<CalendarStatus> {
    return this.http.get<CalendarStatus>(`${this.api}/api/calendar/connections`);
  }

  getConnectUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.api}/api/calendar/google/connect-url`);
  }

  disconnectGoogle(): Observable<{ ok: true }> {
    return this.http.post<{ ok: true }>(`${this.api}/api/calendar/google/disconnect`, {});
  }

  refresh() {
    this.refresh$.next();
  }
}
