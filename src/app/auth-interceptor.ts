import {HttpInterceptor} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {HttpRequest} from "@angular/common/http";
import {HttpHandler} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpEvent} from "@angular/common/http";
import {Router} from "@angular/router";
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor (private router: Router) {}

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log("intercepted request ");
    
    if (req && req.url === environment.homeAutomationApi + "api/partner") {
      return next.handle(req.clone({}));
    }
    if (req && req.url === environment.homeAutomationApi + "api/partner/login") {
      return next.handle(req.clone({}));
    }

    let authRequest = req.clone({
      setHeaders: {
        "Authorization": JSON.parse(localStorage.getItem('partnerToken')),
      }
    });

    return next.handle(authRequest);
  }
}
