import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss'
})
export class VerifyOtpComponent {
  verifyOtp!: FormGroup;
}
