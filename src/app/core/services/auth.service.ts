import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { TokenStorageService } from "./token-storage.service";

type LoginResponse = { token: string };

@Injectable({ providedIn: "root" })
export class AuthService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/login`, { email, password })
      .pipe(tap((res) => this.tokenStorage.setToken(res.token)));
  }

  logout() {
    this.tokenStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getToken();
  }
}
