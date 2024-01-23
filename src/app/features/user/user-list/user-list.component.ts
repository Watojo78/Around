import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TrackByFunction } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { UserActivateComponent } from '../user-activate/user-activate.component';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements AfterViewInit {
  roles: any[] = [];
  usersLength = 0;
  currentUser: any;
  defaultSrc= "../../../assets/avatar_pp_icon.svg";
  roleCounts: Map<number, number> = new Map();
  selectedRoleId = 0; // Default to 'All Users' tab
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['firstName', 'tel', 'numeroCni', 'active', 'actions']; // Adjust as needed

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
shouldShowPortal: any;

  constructor(
    private userService: UserService, 
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
      this.userService.getCurrentUser()
        .subscribe({
          next: (currentUser) => {
            this.currentUser = currentUser; // Store current user data
          },
          error: (err) => console.log("An error occurs while retreiving current User: => ",err)
        }
      );
    }

  ngAfterViewInit() {
    this.fetchUsers();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0))
  }

  private countByRole(users: any[]): Map<number, number> {
    if (!users) return new Map();
    return users.reduce((roleCounts, user) => {
      roleCounts.set(user.roleId, (roleCounts.get(user.roleId) || 0) + 1);
      return roleCounts;
    }, new Map());
  }

  private fetchUsers() {
    this.userService.getAllUsers()
      .pipe(
        map((users: any[]) => users.filter(user => user.id !== this.currentUser.id))
      )
      .subscribe({
        next: (users) => {
          this.dataSource.data = users;
          this.usersLength = users.length;
          this.roleCounts = this.countByRole(users); // Update role counts
        },
        error: (err) => {
          console.error("An unexpected error occurs while retreiving users: =>", err);
          this.snackBar.open("Unexpected error occurs while retreiving users.", "OK");
        },
      });
  
    this.roleService.getAllRoles()
      .subscribe({
        next: (roles) => {
          this.roles = roles
        },
        error: (err) => {
          console.error("An unexpected error occurs while retreiving roles: =>",err);
        }
      });
  }

  private formatSnackbar(message: string, action: string, entityName: string): string {
    return `${action.toUpperCase()} ${entityName}: ${message}`;
  }

  confirmAccountDeletion(id: number){
    this.dialog.open(UserDeleteComponent, {
      width: 'auto',
      data: {id: id}
    });
  }

  confirmInitActivation(email: string){
    this.dialog.open(UserActivateComponent, {
      width: '490px',
      data: {email: email}
    });
  }

} 
