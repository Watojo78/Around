import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { forkJoin, map, switchMap } from 'rxjs';
import { ImageService } from '../../../services/image.service';

import { Image } from '../../../models/image';
import { User } from '../../../models/user';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements AfterViewInit {

  displayedColumns: string[] = ['firstName', 'tel', 'numeroCni', 'role', 'active', 'actions'];
  currentUserId: any;
  loadedUsers: any;
  sortedData: any;
  usersLength = 0;
  adminsLength = 0;
  partnersLength = 0;
  managersLength = 0;
  customersLength = 0;
  roleMap!: Map<number, string>;
  imgSrcMap!: Map<number, string>;
  imgTypeMap!: Map<number, string>; 
  dataSource!: MatTableDataSource<any>;
  admins!: MatTableDataSource<any>;
  partners!: MatTableDataSource<any>;
  managers!: MatTableDataSource<any>;
  customers!: MatTableDataSource<any>;
  defaultSrc= "../../../assets/avatar_pp_icon.svg";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private roleService : RoleService,
    private userService: UserService,
    private imgService: ImageService,
    private paginatorIntl: MatPaginatorIntl){}

  ngAfterViewInit() {
    this.fetchUsers()
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0))
  }

  getRoleName(roleId: number): string | undefined {
    if (this.roleMap?.has(roleId)) {
      return this.roleMap.get(roleId);
    }
    return 'Unknown Role';
  }

  getImageType(profileId: number): string | undefined{
    if (this.imgTypeMap?.has(profileId)) {
      return this.imgTypeMap.get(profileId);
    }
    return 'Unknown type'; // Handle missing image type
  }

  getImageSrc(profileId: number): string | undefined {
    if (this.imgSrcMap?.has(profileId)) {
      return this.imgSrcMap.get(profileId); // Image content encoded as base64 string
    }
    return 'unknow source'; // Handle missing image content
  }
  
  private fetchUsers() {
    // Fetch current user object
    this.userService.getCurrentUser()
      .subscribe({
        next: (userRes)=>{
          this.currentUserId = userRes.id; // Extract current user ID
          
            // Fetch all users and filter out current user
            this.userService.getAllUsers()
              .pipe(
                map(
                  (users: any) => users.filter((user: { id: number; }) => user.id !== this.currentUserId)
                ),
              )
              .subscribe({
                next: (filteredUsers: any) => {
                  this.loadedUsers = filteredUsers;

                  this.usersLength = this.loadedUsers.length;

                  // Fetch img information separately
                  this.imgService.getAllImages()
                  .subscribe({
                    next: (imgs) => {
                      this.imgSrcMap = new Map();
                      this.imgTypeMap = new Map();

                      imgs.forEach((img: { id: number; type: string; }) => {
                        this.imgTypeMap.set(img.id, img.type);
                      });
                      imgs.forEach((img: { id: number; donnees: string; }) => {
                        this.imgSrcMap.set(img.id, img.donnees);
                      });

                      // Enrich user objects with img type
                      for (const user of this.loadedUsers) {
                        if (this.imgTypeMap.has(user.profileId)) {
                          user.img = this.imgTypeMap.get(user.profileId);
                        } 
                        if (this.imgSrcMap.has(user.profileId)) {
                          user.img = this.imgSrcMap.get(user.profileId);
                        } 
                      }
                    },
                    error: (err) => {
                      console.log("An unexpected error occurs while retreiving images => ", err)
                    },
                  })
          
                  // Fetch role information separately
                  this.roleService.getAllRoles()
                    .subscribe({
                        next: (loadedRoles) => {
                          this.roleMap = new Map();
                          loadedRoles.forEach((role: { id: number; name: string; }) => {
                            this.roleMap.set(role.id, role.name);
                          });
            
                          // Enrich user objects with role names
                          for (const user of this.loadedUsers) {
                            if (this.roleMap.has(user.roleId)) {
                              user.role = this.roleMap.get(user.roleId);
                            } else {
                              user.role = 'Unknown Role';
                            }
                          }
          
                          // Initialize separate data sources and paginators for each tab
                          this.admins = new MatTableDataSource(this.loadedUsers.filter((user: { role: string; }) => user.role === 'ADMIN'));
                          //this.admins.paginator = new MatPaginator();
                          this.partners = new MatTableDataSource(this.loadedUsers.filter((user: { role: string; }) => user.role === 'PARTENAIRE'));
                          //this.partners.paginator = new MatPaginator();
                          this.managers = new MatTableDataSource(this.loadedUsers.filter((user: { role: string; }) => user.role === 'GERANT'));
                          //this.managers.paginator = new MatPaginator();
                          this.customers = new MatTableDataSource(this.loadedUsers.filter((user: { role: string; }) => user.role === 'ROLE_USER'));
                          //this.customers.paginator = new MatPaginator();
          
                          this.dataSource = new MatTableDataSource(this.loadedUsers);
                          this.dataSource.paginator = this.paginator;
                          this.dataSource.sort = this.sort;
          
                          this.admins.filterPredicate = (data: any) => data.role === 'ADMIN';
                          this.partners.filterPredicate = (data: any) => data.role === 'PARTENAIRE';
                          this.managers.filterPredicate = (data: any) => data.role === 'GERANT';
                          this.customers.filterPredicate = (data: any) => data.role === 'ROLE_USER';
            
                          this.adminsLength = this.admins.filteredData.length;
                          this.partnersLength = this.partners.filteredData.length;
                          this.managersLength = this.managers.filteredData.length;
                          this.customersLength = this.customers.filteredData.length;
                        },
                        error: (err) => {
                          console.log("there was an error while fetching roles", err)
                        }
                  })
                },
                error: (err) => {
                  console.log("An unexpected error occurs while retreiving filtered Users", err);
                }
              });
          },
        error(err) {
          alert('Unexpected error while trying to retreive current User')
        },
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

  applyFilter(event: Event) {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
} 
