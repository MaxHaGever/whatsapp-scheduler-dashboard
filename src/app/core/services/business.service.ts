import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

export type BusinessUpdateDto = {
  businessName: string;
  timezone: string;
};

@Injectable({ providedIn: "root" })
export class BusinessService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<any>(`${this.base}/api/business`);
  }

  update(dto: BusinessUpdateDto) {
    return this.http.put<any>(`${this.base}/api/business`, dto);
  }
}
