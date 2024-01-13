import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  hide = true;
  error: string = "";

  authForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  submitted = false;
  isLogged = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
      })
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.authForm.invalid) {return;}

    const val = this.authForm.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password)
      .subscribe({
          next: (response) => {
              if (response.token) {
                  this.isLogged = true;
                  this.router.navigate(['/dashboard']);
              } else {
                  console.error('Invalid login response');
                  alert('Invalid credentials. Please try again.');
              }
          },
          error: (error) => {
              console.error(error);
              alert('Invalid credentials. Please try again.');
          },
      });
    }
  }

}
