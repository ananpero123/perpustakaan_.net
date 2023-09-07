import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User, Usertype } from '../Model/model';
import { ConnectionsService } from '../Services/connections.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerform: FormGroup;
  responseMsg: any;

  constructor(
    private fb: FormBuilder,
    private conn: ConnectionsService,
    private letsgo: Router
  ) {
    this.registerform = fb.group({
      Firstname: fb.control('', [Validators.required]),
      Lastname: fb.control('', [Validators.required]),
      Username: fb.control('', [Validators.required]),
      Email: fb.control('', [Validators.required]),
      Password: fb.control('', [Validators.required]),
      Address: fb.control('', [Validators.required]),
      Mobile: fb.control('', [Validators.required]),
    });
  }

  register() {
    let user: User = {
      id: 0,
      Firstname: this.registerform.get('Firstname')?.value,
      Lastname: this.registerform.get('Lastname')?.value,
      Username: this.registerform.get('Username')?.value,
      Email: this.registerform.get('Email')?.value,
      Address: this.registerform.get('Address')?.value,
      Password: this.registerform.get('Password')?.value,
      Mobile: this.registerform.get('Mobile')?.value,
      Image:  '',
      createdon: '',
      usertype: Usertype.USER,
    };
    this.conn.Regis(user).subscribe({
      next: (res: any) => {
        console.log(res);
        this.letsgo.navigate(['login']);
      },
      error: (err: any) => {
        console.log('Error: ');
        console.log(err);
      },
    });
  }

  get Firstname(): FormControl {
    return this.registerform.get('FirstName') as FormControl;
  }
  get Lastname(): FormControl {
    return this.registerform.get('LastName') as FormControl;
  }
  get Username(): FormControl {
    return this.registerform.get('UserName') as FormControl;
  }
  get Email(): FormControl {
    return this.registerform.get('Email') as FormControl;
  }
  get Address(): FormControl {
    return this.registerform.get('Address') as FormControl;
  }
  get Mobile(): FormControl {
    return this.registerform.get('Mobile') as FormControl;
  }
  get Password(): FormControl {
    return this.registerform.get('Password') as FormControl;
  }
}
