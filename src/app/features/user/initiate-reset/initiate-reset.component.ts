import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'initiate-reset',
  templateUrl: './initiate-reset.component.html',
  styleUrl: './initiate-reset.component.scss'
})
export class InitiateResetComponent {
  initiateReset!: FormGroup;
}
