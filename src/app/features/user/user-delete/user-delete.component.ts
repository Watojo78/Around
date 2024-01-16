import { DialogRef } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.scss'
})
export class UserDeleteComponent implements OnInit{
  id!: number;
  userName!: string;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private dialogRef: DialogRef<UserDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public accountId: any,
    private snackBar: MatSnackBar) {}

  
    ngOnInit(): void {
      this.id = this.accountId.id;
      this.getAccount(this.id);
    }

    private getAccount(id: number) {
      this.userService.getUser(id)
      .subscribe({
        next: (response) => {
          this.userName = response.firstName + " " + response.lastName;
        },
        error: (err) => {
          console.log("Error getting shop",err);
          this.snackBar.open("Error getting account", "OK", {duration: 5000});
        }
      })
    }

    deleteAccount(id: number) {
      this.userService.deleteAccount(id)
      .subscribe({
        next: () => {
          this.snackBar.open("Account Successfully deleted", "OK", {duration: 5000});
          this.dialogRef.close();
          window.location.reload();
        },
        error: (err) => {
          console.log("Error deleting account",err);
          this.snackBar.open("Error deleting account", "OK", {duration: 5000});
        }
      })
    }
}
