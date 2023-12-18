import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RoleService } from '../../../services/role.service';

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

  constructor(private roleService : RoleService){
  }

  ngOnInit() {
    this.fetchRoles()
  }
  
  private fetchRoles(){
    this.roleService.getAllRoles()
    .subscribe(res => {
      this.loadedRoles = res; // on data receive populate dataSource.data array
      this.dataSource = new MatTableDataSource(this.loadedRoles)
      console.log("Liste des boutiques : ", this.dataSource)
    });
  }

  deleteRole(id: number){
    this.roleService.delRole(id)
    .subscribe(res => {
      alert("Rôle supprimé avec succès ")
      window.location.reload();
    });
  }

  displayedColumns: string[] = ['id', 'name', 'actions'];
}
