import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from '../../../services/image.service';
import { NeighborhoodService } from '../../../services/neighborhood.service';
import { ServiceService } from '../../../services/service.service';
import { ShopService } from '../../../services/shop.service';
import { UserService } from '../../../services/user.service';
import { Observable, forkJoin, catchError, of, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'shop-create',
  templateUrl: './shop-create.component.html',
  styleUrls: ['./shop-create.component.scss'],
})
export class ShopCreateComponent {
  isLimit = false
  selectedMarker: File | null = null;
  shopId!: number;
  imageData: any[] = []; 
  multiples: any[] = [];
  loadedServices : any;
  loadedUsers : any;
  loadedAddresses : any;
  shopForm: FormGroup;
  selectedFiles?: FileList;
  markerUrl: string | ArrayBuffer | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('markerInput') markerInput!: ElementRef;

  constructor(
    private http: HttpClient, 
    private shopService: ShopService,
    private serService: ServiceService,
    private userService: UserService,
    private imgService : ImageService,
    private cf: ChangeDetectorRef,
    private neighborhoodService: NeighborhoodService,
    private snackBar: MatSnackBar,
    private fb:FormBuilder){

    this.shopForm = this.fb.group({
      active: false,
      nomBoutique: '',
      longitude: 0,
      latitude: 0,
      emplacement: '',
      tel: 0,
      niu: '',
      serviceIds:[''],
      ownerId:[''],
      /*imageIds: this.fb.array([]),*/
      quartierId: 1,
      heureOuverture: this.fb.group(
        this.daysOfWeek.reduce((acc: any, day) => {
          acc[day] = this.fb.group({
            heureDebut: ['08:00:00', Validators.required],
            heureFin: ['18:00:00', Validators.required],
          });
          return acc;
        }, {}),
      ),
    })
  }

  ngOnInit(){
    this.fetchServices()
    this.fetchUsers()
    this.fetchAdresses()
  }

  onFormSubmit(){
    if(this.shopForm.valid){
      console.warn(this.shopForm.value)
      this.shopService.newShop(this.shopForm.value)
      .subscribe({
        next :(shopId)=>{
          this.shopId = shopId;
          console.log("Boutique créée à 75% :); now processing shop's marker...", shopId)
          this.snackBar.open("Boutique créée à 75% :)", "Succès", {
            duration: 5000,
          })

          if (!this.selectedMarker) {
            console.log('Aucun marqueur sélectionné.:(');
            this.snackBar.open("Aucun marqueur sélectionné.:(", "", {
              duration: 5000,
            })
            return;
          }

          const markerData = new FormData();
          markerData.append('fichier', this.selectedMarker);
          markerData.append('description', "shop's marker");
          markerData.append('boutiqueId', shopId);
          console.log(markerData.get('description'));
          this.snackBar.open("Traitement du marqueur...", "", {
            duration: 5000,
          })
          this.uploadMarker(markerData)
          .subscribe({
              next: (res: any)=>{
                console.log('Marqueur créé avec succès :).')
                this.snackBar.open('Marqueur créé avec succès :)', 'Fermer', 
                {
                  duration: 5000
                }
                )
              },
              error: (err: any)=>{
                console.log("Echec de création du marqueur, échec :(", err)
                this.snackBar.open('Erreur lors de la création du marqueur', 'Fermer',
                  {
                    duration: 5000,
                    panelClass: ['error-snackbar'] // Optional custom CSS class
                  }
                );
              }
            })
        },
        error: (err)=>{
          this.snackBar.open('Erreur à la création de la Boutique', '',
            {
              duration: 5000,
              panelClass: ['error-snackbar'] // Optional custom CSS class
            }
          );
          console.log("Une erreur inanttendue est survenue lors de la création de la boutique",err)
        }
      })
    }
  }

  openMarkerInput(): void {
    this.markerInput.nativeElement.click();
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  selectMarker(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = (inputElement.files as FileList)[0];

    if (file) {
      this.selectedMarker = file;
      this.previewMarker(file);
    }
  }

  selectImages(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const shopThumbs = inputElement.files;
    const shopThumbsCond = inputElement.files && inputElement.files.length;

    if (shopThumbsCond && shopThumbsCond < 6) {
      let singleFile: File | any = null;

      for(let i=0; i<shopThumbsCond; i++){
        singleFile = shopThumbs![i];
        //this.urls.push(URL.createObjectURL(singleFile));
        var reader = new FileReader();
        reader.readAsDataURL(singleFile);
        this.cf.detectChanges();
        reader.onload = (event) => {
          try {
            let url = (<FileReader>event.target).result as string;
            /*let src = url.split(',')
            let base64url = src.pop()*/
            this.multiples.push(url);
            let desc = "Shop's thumbnail "+(i+1);
  
            // Temporarily store image data
            this.imageData.push({
              url: url,
              description: desc,
              type: singleFile.type
            });
            /*let imageFormGroup = this.fb.group({ type: singleFile.type, donnees: base64url, description: desc });
            let imgIdsGroup: any = this.shopForm.get('imageIds');
            imgIdsGroup.push(imageFormGroup);  
            this.imageIds = imgIdsGroup.value;*/
            this.cf.detectChanges();
            console.log("current urls pop list :", this.imageData);
            
            // Trigger upload only after shopId is available
            if (this.imageData.length === shopThumbsCond && this.shopId) {
              this.uploadImages(this.shopId);
            }
          } catch (error) {
            console.error('Error processing images:', error);
            this.snackBar.open('Erreur lors du traitement des images:'+ error, 'Fermer',
              {
                duration: 5000,
                panelClass: ['error-snackbar'] // Optional custom CSS class
              }
            );
          }
        };
      }
    }else{this.isLimit = true;}
  }

  private uploadImages(shopId: number) {
    this.uploadShopImages(this.imageData)
      .subscribe({
        next: (processedImages: any) => {
          // Associate shopId with each image
          processedImages.forEach((image: { boutiqueId: number; }) => image.boutiqueId = shopId);
    
          // Handle the processed images (e.g., display success messages, clear stored data)
          console.log("Images uploaded successfully :) =>", processedImages,"Création de la boutique 100% achevée.");
          this.imageData = []; // Clear temporary storage
          this.snackBar.open('Shop 100% créé avec succès!', 'Fermer',
            {
              duration: 5000,
              panelClass: ['success-snackbar'] // Optional custom CSS class
            }
          );
        },
        error: (err: any) => {
          console.error('Error while uploading images:', err);
          this.snackBar.open('Erreur lors de l\'ajout des images', 'Fermer',
            {
              duration: 5000,
              panelClass: ['error-snackbar'] // Optional custom CSS class
            }
          );
          // Handle errors gracefully, potentially retrying or notifying the user
        }
      });
  }

  private uploadShopImages(imageDataList: any[]):any {
    return forkJoin(
      imageDataList?.map(imageData => this.imgService.newShopImage(imageData))
    ).pipe(
      catchError(error => {
        console.error('Error while uploading images:', error);
        // Handle errors gracefully, potentially retrying or notifying the user
        return of(null); // Return a placeholder value to handle errors
      })
    );
  }

  removeItem(index: number) {
    //this.urls.splice(index, 1);
    this.multiples.splice(index, 1);
    this.cf.detectChanges();
    console.log("updated urls pop list :", this.multiples);
  }

  private previewMarker(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.markerUrl = reader.result;
    };
  }

  uploadMarker(data: any) {
    return this.imgService.newShopImage(data);
  }

  private fetchServices(){
    this.serService.getAllServices()
    .subscribe({
      next: (res) => {
        this.loadedServices = res;
      },
      error: (err) => {
        console.log("Something went wrong while retreiving services => ", err)
      }
    });
  }

  private fetchUsers(){
    this.userService.getAllUsers()
    .pipe(
      // Filter users with roles 'gerant' and 'partner'
      map((users) => users.filter((user: { roleId: number; }) => user.roleId == 3 || user.roleId == 4)),
      // Sort by creation date (descending)
    )
    .subscribe({
      next: (res) => {
        this.loadedUsers = res;
      },
      error: (err) => {
        console.log("Something went wrong while retreiving users => ", err)
      }
    });
  }

  private fetchAdresses(){
    this.neighborhoodService.getAllNeighborhoods()
    .subscribe({
      next: (res) => {
        this.loadedAddresses = res;
      },
      error: (err) => {
        console.log("Something went wrong while retreiving addresses => ", err)
      }
    });
  }
}


