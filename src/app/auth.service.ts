import { Injectable } from "@angular/core";
import { filter } from "rxjs/operators";
import * as auth0 from "auth0-js";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public idToken: string;
  public accessToken: string;
  public expiresAt: number;

  auth0 = new auth0.WebAuth({
    clientID: "",
    domain: "",
    responseType: "token id_token",
    redirectUri: "http://localhost:3000/callback",
    scope: "openid email"
  });

  constructor() {
    this.idToken = "";
    this.accessToken = "";
    this.expiresAt = 0;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log(authResult);
        window.location.hash = "";
        this.setSession(authResult);
        //this.router.navigate(['/home']);
      } else if (err) {
        //this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem("isLoggedIn", "true");
    // Set the time that the access token will expire at
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
  }

  public renewSession(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`
        );
        this.logout();
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    this.accessToken = "";
    this.idToken = "";
    this.expiresAt = 0;
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem("isLoggedIn");
    // Go back to the home route
    //this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return new Date().getTime() < this.expiresAt;
  }
}
