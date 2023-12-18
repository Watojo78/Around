import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../../../services/category.service';
import { ShopService } from '../../../services/shop.service';
import { ServiceService } from '../../../services/service.service';
import { ImageService } from '../../../services/image.service';

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
    private serService: ServiceService,
    private catService : CategoryService,
    private shopService: ShopService,
    private imgService: ImageService,
    private paginatorIntl: MatPaginatorIntl){}

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

    getImageType(id: number): string | undefined{
      if (this.imgTypeMap?.has(id)) {
        return this.imgTypeMap.get(id);
      }
      return;
    }
  
    getImageSrc(id: number): string | undefined{
      if (this.imgSrcMap?.has(id)) {
        return this.imgSrcMap.get(id) as string;
      }
      return '';
    }

    private fetchServices(){
      this.serService.getAllServices()
      .subscribe({
        next: (serviceRes) => {
          this.loadedServices = serviceRes;
          this.servicesLength = this.loadedServices.length;

          this.imgService.getAllImages()
          .subscribe({
            next: (imgs) => {
              this.imgSrcMap = new Map();
              this.imgTypeMap = new Map();

              imgs.forEach((img: {id: number; type: string;}) => {
                this.imgTypeMap.set(img.id, img.type);
              });
              imgs.forEach((img: {id: number; donnees: string;}) => {
                this.imgSrcMap.set(img.id, img.donnees);
              });

              // Enrich user objects with img type
              for (const service of this.loadedServices) {
                if (this.imgTypeMap.has(service.id)) {
                  service.img = this.imgTypeMap.get(service.id);
                } 
                if (this.imgSrcMap.has(service.id)) {
                  service.img = this.imgSrcMap.get(service.id);
                } 
              }

            },
            error: (err) => {
              console.log("An unexpected error occurs while retreiving images => ", err)
            }
          })

          this.catService.getAllCategories()
          .subscribe({
            next: (catRes) => {
              this.loadedCats = catRes;
              console.log("liste des categories", this.loadedCats)
              this.catMap = new Map();
              this.loadedCats.forEach((cat: { idCategorie: number; nomCategorie: string; }) => {
              this.catMap.set(cat.idCategorie, cat.nomCategorie);
            });
            console.log("catMap", this.catMap)
    
            // Enrich service objects with cat names
            for (const service of this.loadedServices) {
              if (this.catMap.has(service.catId)) {
                service.cat = this.catMap.get(service.catId);
              } else {
                service.cat = 'Unknown cat';
              }
            }
                  
            this.dataSource = new MatTableDataSource(this.loadedServices);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            },
            error: (err) => {
              console.log("An unexpected error occurs while retreiving categories", err)
            }
          });
        },
        error: (err) =>{
          console.log("An unexpected error occurs while retreiving services:",err)
        }
      });
    }

    deleteService(id: number){
      this.serService.delService(id)
      .subscribe({
        next: (res) => {
          alert("Service supprimé avec succès ")
          window.location.reload();
        },
        error: (err) => {
          console.log("An unexpected error occurs while deleting the service ", err)
        }
      });
    }
}
