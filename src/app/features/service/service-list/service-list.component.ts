import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../../../services/category.service';
import { ServiceService } from '../../../services/service.service';
import { ImageService } from '../../../services/image.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDeleteComponent } from '../service-delete/service-delete.component';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})

export class ServiceListComponent implements AfterViewInit {

  displayedColumns: string[] = ['nomService', 'description', 'categorieId', 'actions'];
  loadedServices: any;
  loadedCats: any;
  loadedShops: any;
  sortedData: any;
  nomService: any;
  description: any;
  categorieId: any;
  imageIds: any;
  dataSource!: MatTableDataSource<any>;
  servicesLength = 0;
  catMap!: Map<number, string>;
  imgTypeMap!: Map<number, string>;
  imgSrcMap!: Map<number, string>;
  defaultSrc= '../../../assets/servicesample.svg';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private serService: ServiceService,
    private catService : CategoryService,
    private dialog: MatDialog,
    private imgService: ImageService){}

  ngAfterViewInit() {
    this.fetchServices()
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }


  getCatName(catId: number): string | undefined {
    if (this.catMap.has(catId)) {
      return this.catMap.get(catId);
    }
      return 'Unknown Category';
  }

  private fetchServices(){
    this.serService.getAllServices()
      .subscribe({
        next: (serviceRes) => {
          this.loadedServices = serviceRes;
          this.servicesLength = this.loadedServices.length;

          this.catService.getAllCategories()
          .subscribe({
            next: (catRes) => {
              this.loadedCats = catRes;
              console.log("liste des categories", this.loadedCats)
              this.catMap = new Map();
              this.loadedCats.forEach((cat: { idCategorie: number; nomCategorie: string; }) => {
                this.catMap.set(cat.idCategorie, cat.nomCategorie);
              });
              //console.log("catMap", this.catMap)
    
              // Enrich service objects with cat names
              for (const service of this.loadedServices) {
                if (this.catMap.has(service.catId)) {
                  service.cat = this.catMap.get(service.catId);
                } else {
                  service.cat = 'Unknown category';
                }
              }
                  
              this.dataSource = new MatTableDataSource(this.loadedServices);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              },
              error: (err) => {
                console.log("An unexpected error occurs while retreiving categories", err)
                this.snackBar.open('Problem retreiving categories, see log for details', err, {
                    duration: 2000
                  })
              }
          });
        },
        error: (err) =>{
          console.log("An unexpected error occurs while retreiving services:",err)
          this.snackBar.open('Problem retreiving services, see log for details', err, {
            duration: 2000
          })
        }
    });
  }

  confirmServiceDeletion(id: number){
    this.dialog.open(ServiceDeleteComponent, {
      width: 'auto',
      data: {id: id}
    });
  }
}
