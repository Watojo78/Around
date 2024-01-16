import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NeighborhoodService } from '../../../services/neighborhood.service';
import { ShopService } from '../../../services/shop.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ShopDeleteComponent } from '../shop-delete/shop-delete.component';

@Component({
  selector: 'shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements AfterViewInit {

  displayedColumns: string[] = ['nomBoutique', 'longitude', 'latitude', 'active', 'serviceIds', 'quartierId', 'actions'];
  shops: any;
  shopsLength: any;
  neighborhoods: any;
  dataSource: any;
  sortedData: any;
  map: any;
  eventEmitter: any;
  addressMap!: Map<number, string>;
  myPositionMarker: any;
  mapOptions = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private shopService: ShopService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private neighborhoodService: NeighborhoodService){}

  ngAfterViewInit() {
    this.fetchShops()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.centerMapOnPosition(position);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Handle errors gracefully, e.g., display a message to the user
        },
        { enableHighAccuracy: true } // Optional: Request more accurate position
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  centerMapOnPosition(position: GeolocationPosition) {
    this.mapOptions = {
      zoom: 16,
      disableDefaultUI: true, // Hide default UI elements, including markers and logo
      styles: [ // Optional: Apply a custom map style for a cleaner look
        { elementType: 'labels', stylers: [{ visibility: 'off' }] },
        // Add more styles as desired
      ],
      center: { lat: position.coords.latitude, lng: position.coords.longitude },
    };

    if (this.myPositionMarker) {
      // Update existing marker position
      this.myPositionMarker.setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } else {
      // Create a new marker
      this.myPositionMarker = new google.maps.Marker({
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        map: this.map, // ensure you have access to the map object
        icon: { // optional: customize marker icon for user position
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'blue',
          fillOpacity: 0.7,
          scale: 10,
          strokeColor: 'white',
          strokeWeight: 2,
        },
      });
    }
  }

  getNeighborhoodName(quartierId: number): any {
    if (this.addressMap?.has(quartierId)) {
      return this.addressMap.get(quartierId);
    }
    return 'Unknown neighborhood';
  }

  private createMarker(shop: any) {
    return new google.maps.Marker({
      position: { lat: shop.latitude, lng: shop.longitude },
      map: this.map, // Assuming you have a map element in your template
      // Customize marker icon and other options as needed
    });
  }

  onMarkerClick(shop: any) {
    // Highlight the clicked marker:
    shop.marker.setIcon('path/to/highlighted-marker-icon.png');
  
    // Zoom the map to the marker's location:
    this.map.setCenter(shop.marker.getPosition());
    this.map.setZoom(15); // Adjust zoom level as needed
  
    // Display a customized info window with rich content:
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="shop-info-window">
          <h2>${shop.name}</h2>
          <img src="${shop.imageUrl}" alt="${shop.name}">
          <p>Address: ${shop.address}</p>
          <p>Phone: ${shop.phone}</p>
          <a href="tel:${shop.phone}">Call Now</a>
          <a href="/shops/${shop.id}">View Details</a>
        </div>
      `
    });
    infoWindow.open(this.map, shop.marker);
  
    // Trigger an external event or data update:
    this.eventEmitter.emit('shopClicked', shop); // Assuming you have an event emitter
  }
  
  private fetchShops(){
    this.shopService.getAllShops()
    .subscribe({
      next:(loadedShops) => {
        this.shops = loadedShops;
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
        console.log("Unexpected error occurs while fetching the shops", err)
        this.snackBar.open('Unexpected error occurs while fetching the shops', 'Failed', {
          duration: 3000
        });
      }
    });
  }

  confirmShopDeletion(id: number){
    this.dialog.open(ShopDeleteComponent, {
      width: 'auto',
      data: {id: id}
    });
  }

}
