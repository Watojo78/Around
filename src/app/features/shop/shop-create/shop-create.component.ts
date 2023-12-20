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
})
export class ShopCreateComponent {
  logo: any;
  isLimit = false
  selectedLogo: File | null = null;
  urls: any[] = [];
  imageIds: any[] = [];
  multiples: any[] = [];
  loadedServices : any;
  loadedUsers : any;
  loadedAddresses : any;
  shopForm: FormGroup;
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
      imageIds: this.fb.array([]), 
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
          console.log("Boutique créée à 75% :); now processing shop's logo...", res)

          if (!this.selectedLogo) {
            console.log('Please select an image before uploading.:(');
            return;
          }

          const logoData = new FormData();
          logoData.append('fichier', this.selectedLogo);
          logoData.append('description', "shop's logo");
          logoData.append('boutiqueId', res);
          console.log(logoData.get('description'));
          this.uploadLogo(logoData)
          .subscribe({
              next: (res: any)=>{
                console.log('Instance créée avec succès :).')
                alert("Création Boutique 100%, succès :)")
              },
              error: (err: any)=>{
                alert("erreur lors de création du logo de la boutique")
                console.log("Création Boutique 100%, echec :(", err)
              }
            })
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

  selectImages(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const shopThumbs = inputElement.files;
    const shopThumbsCond = inputElement.files && inputElement.files.length;

    if (shopThumbsCond && shopThumbsCond < 6) {
      let singleFile: File | any = null;

      for(let i=0; i<shopThumbsCond; i++){
        singleFile = shopThumbs![i];
        this.urls.push(URL.createObjectURL(singleFile));
        var reader = new FileReader();
        reader.readAsDataURL(singleFile);
        this.cf.detectChanges();
        reader.onload = (event) => {
          const url = (<FileReader>event.target).result as string;
          const src = url.split(',')
          const base64url = src.pop()
          this.multiples.push(url);
          const desc = "Shop's thumbnail "+(i+1);
          const imageFormGroup = this.fb.group({ type: singleFile.type, donnees: base64url, description: desc });
          const imgIdsGroup: any = this.shopForm.get('imageIds');
          imgIdsGroup.push(imageFormGroup);  
          this.imageIds = imgIdsGroup.value;
          console.log("current urls thumb list :", this.urls);
          console.log("current multiples pop list :", this.multiples);
          console.log("current urls pop list :", this.imageIds);
          this.cf.detectChanges();
        };
      }
    }else{this.isLimit = true;}
  }

  removeItem(index: number) {
    this.urls.splice(index, 1);
    this.multiples.splice(index, 1);
    this.imageIds.splice(index, 1);
    this.cf.detectChanges();
  }

  previewLogo(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.logoUrl = reader.result;
    };
  }

  uploadLogo(data: any) {
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
