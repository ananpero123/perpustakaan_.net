import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectionsService } from '../Services/connections.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginform: FormGroup;
  responseMsg: string = '';
  constructor(
    private formsw: FormBuilder,
    private letsgo: Router,
    private koneks: ConnectionsService
  ) {
    this.loginform = formsw.group({
      email: formsw.control('', [Validators.required]),
      password: formsw.control('', [Validators.required]),
    });
  }

  log() {
    let logins = {
      email: this.loginform.get('email')?.value,
      password: this.loginform.get('password')?.value,
    };

    this.koneks.Logins(logins).subscribe({
      next: (res: any) => {
        if (res.toString() === 'invalid')
          this.responseMsg = 'Invalid Credential x-x';
        else {
          this.koneks.Nyimpantoken(res.toString());
          this.responseMsg = '';
          this.letsgo.navigate(['Libraryku/home']);
        }
      },
      error: (err: any) => {
        console.log('Error');
        console.log(err);
      },
    });
  }
}
