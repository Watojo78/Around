import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from '../../../services/image.service';
import { NeighborhoodService } from '../../../services/neighborhood.service';
import { ServiceService } from '../../../services/service.service';
import { ShopService } from '../../../services/shop.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'shop-create',
  templateUrl: './shop-create.component.html',
  styleUrls: ['./shop-create.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ShopCreateComponent {
  files: any;
  logo: any;
  index!: number;
  selectedLogo: File | null = null;
  urls: any[] = [];
  multiples: any[] = [];
  loadedServices : any;
  loadedUsers : any;
  loadedAddresses : any;
  shopForm:FormGroup;
  previews: string[] = [];
  selectedFiles?: FileList;
  logoUrl: string | ArrayBuffer | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('logoInput') logoInput!: ElementRef;

  constructor(
    private http: HttpClient, 
    private shopService: ShopService,
    private serService: ServiceService,
    private userService: UserService,
    private imgService : ImageService,
    private cf: ChangeDetectorRef,
    private neighborhoodService: NeighborhoodService,
    private fb:FormBuilder){

    this.shopForm = this.fb.group({
      active: false,
      nomBoutique: '',
      longitude: 0,
      latitude: 0,
      emplacement: '',
      tel: 0,
      niu: 0,
      serviceIds:[''],
      compteIds:[''],
      quartierId: 0,
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
        next :(res)=>{
          alert("Boutique créée avec succès :)")
        },
        error: (err)=>{
          alert("Erreur lors de la création de la boutique")
          console.log("Une erreur inanttendue est survenue lors de la création de la boutique",err)
        }
      })
    }
  }

  openLogoInput(): void {
    this.logoInput.nativeElement.click();
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  selectLogo(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = (inputElement.files as FileList)[0];

    if (file) {
      this.selectedLogo = file;
      this.previewLogo(file);
    }
  }

  selectImages(event: any): void {
    this.files = event.target.files && event.target.files.length;
    if (this.files > 0 && this.files < 7) {
      let i: number = 0;
      for (const singlefile of event.target.files) {
        var reader = new FileReader();
        singlefile.index = i;
        reader.readAsDataURL(singlefile);
        this.urls.push(singlefile);
        this.cf.detectChanges();
        i++;
        this.index = this.urls.indexOf(singlefile);
        console.log(this.urls);
        reader.onload = (event) => {
          const url = (<FileReader>event.target).result as string;
          this.multiples.push(url);
          this.cf.detectChanges();
        };
        console.log(singlefile);
      }
    }
  }

  removeItem(index: number) {
    this.urls.splice(index, 1);
    this.multiples.splice(index, 1);
    this.cf.detectChanges();
    console.log("nouvelle liste chaînée:", this.urls);
    console.log(this.multiples);
  }

  previewLogo(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.logoUrl = reader.result;
    };
  }

  uploadImage(data: any) {
    return this.imgService.newAccountImage(data);
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
