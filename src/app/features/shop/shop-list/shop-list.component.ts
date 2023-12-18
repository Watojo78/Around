import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NeighborhoodService } from '../../../services/neighborhood.service';
import { ShopService } from '../../../services/shop.service';

@Component({
  selector: 'shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements AfterViewInit {

  displayedColumns: string[] = ['nomBoutique', 'longitude', 'latitude', 'active', 'serviceIds', 'quartierId', 'actions'];
  shopsLength: any;
  neighborhoods: any;
  dataSource: any;
  sortedData: any;
  addressMap!: Map<number, string>;
  center: google.maps.LatLngLiteral = {lat:4.049390994158872, lng: 9.70068984164174};
  zoom:number = 20;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions.push(event.latLng!.toJSON());
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private shopService: ShopService,
    private neighborhoodService: NeighborhoodService){
  }

  ngAfterViewInit() {
    this.fetchShops()
  }

  getNeighborhoodName(quartierId: number): any {
    if (this.addressMap?.has(quartierId)) {
      return this.addressMap.get(quartierId);
    }
    return 'Unknown neighborhood';
  }
  
  private fetchShops(){
    this.shopService.getAllShops()
    .subscribe({
      next:(loadedShops) => {
      this.dataSource = new MatTableDataSource(loadedShops);
      this.shopsLength = loadedShops.length

      // Fetch neighborhoods information separately
      this.neighborhoodService.getAllNeighborhoods()
      .subscribe(res => {
        this.neighborhoods = res;
        this.addressMap = new Map();
        this.neighborhoods.forEach((neighborhood: {id: number; nomQuartier: string}) => {
          this.addressMap.set(neighborhood.id, neighborhood.nomQuartier);
        });
        console.log(this.addressMap)

        // Enrich shop objects with neighborhood names
        for (const shop of loadedShops) {
          if (this.addressMap.has(shop.quartierId)) {
            shop.role = this.addressMap.get(shop.roleId);
          } else {
            shop.role = 'Unknown neighborhood';
          }
        }

        this.dataSource.paginator = this.paginator;
      })
      },
      error: (err) =>{

      }
    });
  }

  deleteShop(id: number){
    this.shopService.deleteShop(id)
    .subscribe({
      next:(res) => {
        alert("Boutique supprimé avec succès ")
        window.location.reload();
      },
      error: (err) => {
        console.log("Unexpected error occurs while deleting the shop", err)
      }
    });
  }

}
