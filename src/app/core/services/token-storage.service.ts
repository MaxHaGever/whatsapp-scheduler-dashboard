import { Injectable } from "@angular/core";

const TOKEN_KEY = "auth_token";

@Injectable({ providedIn: "root" })
export class TokenStorageService {
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  clear(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(TOKEN_KEY);
  }
}
