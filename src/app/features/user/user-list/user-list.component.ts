import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TrackByFunction } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';

import { Image } from '../../../models/image';
import { User } from '../../../models/user';
import { MatTabChangeEvent } from '@angular/material/tabs';

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

  constructor(
    private userService: UserService, 
    private roleService: RoleService,
    private paginatorIntl: MatPaginatorIntl) {
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
      .subscribe({
        next: (users) => {
          this.dataSource.data = users;
          this.usersLength = users.length;
          this.roleCounts = this.countByRole(users); // Update role counts
        },
        error: (err) => {
          console.error("An unexpected error occurs while retreiving users: =>",err);
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

  deleteUser(id: number){
    this.userService.deleteAccount(id)
    .subscribe(res => {
      alert("Utilisateur supprimé avec succès")
      window.location.reload();
    });
  }

  enableUser(id: number){
    this.userService.activateUser(id)
    .subscribe(res => {
      alert("Compte activé avec succès :)")
      window.location.reload();
    })
  }


  private trackByUserId: TrackByFunction<User> = (index: number, user: User) => user.id;

} 
