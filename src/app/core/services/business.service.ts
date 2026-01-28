import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export type BusinessDto = {
  _id?: string;
  name: string;
  timezone: string;
  phoneNumberId?: string | null;
  wabaId?: string | null;
};

@Injectable({ providedIn: "root" })
export class BusinessService {
  private api = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getBusiness(): Observable<BusinessDto> {
    return this.http.get<BusinessDto>(`${this.api}/api/business`);
  }

  // Onboarding expects `updateBusiness`
  updateBusiness(payload: Partial<BusinessDto>): Observable<BusinessDto> {
    return this.http.put<BusinessDto>(`${this.api}/api/business`, payload);
  }
}
