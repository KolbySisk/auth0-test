import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "auth0-test";
  users: any = [];

  constructor(private authService: AuthService, private http: HttpClient) {
    authService.handleAuthentication();
  }

  register() {
    this.http
      .post("http://localhost:8641/user/register", {
        email: "yo@yo.com",
        username: "yo",
        password: "yo"
      })
      .subscribe(data => {
        this.authService.idToken = data as string;
      });
  }

  login() {
    this.http
      .post("http://localhost:8641/user/login", {
        email: "yo@yo.com",
        password: "yo"
      })
      .subscribe(data => {
        this.authService.idToken = data as string;
      });
  }

  getProfile() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.authService.idToken
    });

    this.http
      .get("http://localhost:8641/user", {
        withCredentials: true
      })
      .subscribe(data => {
        console.log(data);
      });
  }

  getUsers() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.authService.idToken
    });

    this.http
      .get("http://localhost:8641/users", {
        headers: headers,
        withCredentials: true
      })
      .subscribe(data => {
        this.users = data;
      });
  }

  follow(user) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.authService.idToken
    });

    this.http
      .post("http://localhost:8641/user/follow", user, { headers: headers })
      .subscribe(data => {
        console.log(data);
      });
  }

  unfollow(user) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.authService.idToken
    });

    this.http
      .post("http://localhost:8641/user/unfollow", user, { headers: headers })
      .subscribe(data => {
        console.log(data);
      });
  }

  logOut() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.authService.idToken
    });

    this.http
      .get("http://localhost:8641/user/logout", { headers: headers })
      .subscribe(data => {
        console.log(data);
      });
  }
}
