import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogin: boolean;
  loginEmail: string;
  loginPassword: string;

  createUserName: string;
  createPassword: string;
  createEmail: string;
  createNumber: string;
  x: string;
  partner: any;

  constructor(private toastr: ToastrService,
    private appService: AppService,
    private router: Router) {
  }

  ngOnInit() {
    this.isLogin = true
    this.loginEmail = '';
    this.loginPassword = '';
    this.createUserName = '';
    this.createEmail = '';
    this.createPassword = '';
    this.createNumber = '';
  }

  login() {
    let email = this.loginEmail;
    let password = this.loginPassword;
    let isValid = this.validateEmail(email);
    if (isValid) {
      this.appService.logIn(email, password)
      .subscribe((partnerResponse: any) => {
        console.log(partnerResponse);
        localStorage.setItem('partnerToken', JSON.stringify(partnerResponse.headers.get('Authorization')));
        this.partner = partnerResponse.body.data
        localStorage.setItem('userDetail', JSON.stringify(this.partner));
        this.router.navigateByUrl('/dashboard')

      },
        (err) => {
          err = err.error
          this.toastr.error(err.message || 'Some error occured, please try after some time')
          this.loginPassword = ''
        })
    } else {
      this.toastr.error('Email string is not valid');
    }
  }
  validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true);
    }
    return (false);
  }

  register() {
    if (this.createUserName && this.validateEmail(this.createEmail) && this.createPassword && this.createNumber) {
      let body = {
        "name": this.createUserName,
        "email": this.createEmail,
        "password": this.createPassword,
        "contactNumber": this.createNumber
      }
      this.appService.register(body).subscribe(
        (res) => {
          this.toastr.success('Succesfully registered');
          this.isLogin = true
          this.loginEmail = this.createEmail
          this.resetCreateAccount();
        },
        (err) => {
          err = err.error
          this.toastr.error(err.message || 'Some error occured, please try after some time')
        }
      )
    }
  }

  resetCreateAccount(){
    this.createUserName = '';
    this.createEmail = '';
    this.createPassword = '';
    this.createNumber = '';
  }
}
