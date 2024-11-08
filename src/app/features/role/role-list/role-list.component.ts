import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RoleService } from '../../../services/role.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RoleCreateComponent } from '../role-create/role-create.component';
import { RoleDetailComponent } from '../role-detail/role-detail.component';
import { RoleDeleteComponent } from '../role-delete/role-delete.component';
import { map } from 'rxjs';

const token = sessionStorage.getItem('token');
const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Authorization', `Bearer ${token}`)



@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  loadedRoles: any;
  dataSource: any;
  sortedData: any;

  constructor(
    private roleService : RoleService,
    private matSnackbar: MatSnackBar,
    private dialog: MatDialog){}

  ngOnInit() {
    this.fetchRoles()
  }
  
  private fetchRoles(){
    this.roleService.getAllRoles()
      .pipe(
        map((roles: any[]) => roles.filter(role => role.name !== "ADMIN"))
      )
      .subscribe({
        next:(res) => {
          this.loadedRoles = res; // on data receive populate dataSource.data array
          this.dataSource = new MatTableDataSource(this.loadedRoles)
          console.log("Liste des boutiques : ", this.dataSource)
        },
        error:(err) => {
          console.log("Erreur lors de la récupération des rôles", err)
          this.matSnackbar.open("Erreur lors de la récupération des rôles", "Erreur recupération", {
            duration: 2000,
          })
        },
      });
  }

  openRoleCreateForm(){
    this.dialog.open(RoleCreateComponent, {
      width: '400px',
    });
  }

  openRoleEditForm(data: any){
    this.dialog.open(RoleCreateComponent, {
      width: '400px',
      data: {data: data}
    });
  }

  openRoleDetail(id: number){
    this.dialog.open(RoleDetailComponent, {
      width: '400px',
      data: {id: id}
    });
  }

  confirmRoleDeletion(id: number){
    this.dialog.open(RoleDeleteComponent, {
      width: '400px',
      data: {id: id}
    });
  }

  displayedColumns: string[] = ['id', 'name', 'actions'];
}
