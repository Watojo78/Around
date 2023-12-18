import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ImageService } from '../../../services/image.service';
import { ServiceService } from '../../../services/service.service';

@Component({
  selector: 'app-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.scss']
})
export class ServiceEditComponent {
  id!: number;
  file: any;
  serviceId: any;
  loadedCats: any;
  loadedServices: any;
  serviceForm: FormGroup;
  selectedImage: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private router: Router,
    private imgService: ImageService,
    private route: ActivatedRoute,
    private serService: ServiceService, 
    private catService: CategoryService,
    private fb:FormBuilder){

    this.serviceForm = this.fb.group({
      nomService:'',
      description:'',
      categorieId: 1,
    })
  }

    ngOnInit(){
      this.fetchCats()
      this.route.params
        .subscribe((params: Params) => {
          this.id = +params['id'];
          this.serService.getService(this.id)
            .subscribe({
              next: (service) => {
                this.serviceForm.patchValue(service)
              },
              error: (error) => {
                if (error) {
                  // Redirect to dashboard if service not found
                  alert("La catégorie n'existe pas !!")
                  this.router.navigate(['/dashboard/service/list']);
                } else {
                  // Handle other errors
                  console.error('Unexpected error occurs while retrieving service:', error);
                }
              },
            });
        });
    }

    onFormSubmit(){
      if(this.serviceForm.valid){
        console.warn(this.serviceForm.value)
        this.serService.newService(this.serviceForm.value)
        .subscribe({
          next :(serviceRes: any)=>{
            const serviceName = serviceRes.nomService
            console.log("Service créée avec succès :)")
            console.log("Now registering profile img...")

            if (!this.selectedImage) {
              console.log('Please select an image before uploading.:(');
              return;
            }

            const formData = new FormData();
            formData.append('fichier', this.selectedImage);
            formData.append('description', "Thumbnail service:"+serviceName);
            formData.append('serviceId', this.serviceId);
            console.log(formData.get('serviceId'));
            
            this.uploadImage(formData)
            .subscribe({
              next: (res: any)=>{
                console.log('Instance créée avec succès :).')
                alert("profil créé avec succès")
                this.router.navigate(['/dashboard/user/list'])
              },
              error: (err: any)=>{
                alert("erreur lors de création de la miniature du service")
                console.log("erreur lors de création de la miniature du service", err)
              }
            })
            this.router.navigate(['/dashboard/service/list'])
          },
          error: (err: any)=>{
            alert("Unexpected error while registering the service"+err)
            console.log("Erreur d'enregistrement: ", err)
          }
        })
      }
    }

    openFileInput(): void {
      this.fileInput.nativeElement.click();
    }
  
    onFileSelected(event: Event): void {
      const inputElement = event.target as HTMLInputElement;
      const file = (inputElement.files as FileList)[0];
  
      if (file) {
        this.selectedImage = file;
        this.previewImage(file);
      }
    }
  
    previewImage(file: File): void {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
  
    uploadImage(data: any) {
      return this.imgService.newAccountImage(data);
    }
  
    private fetchCats(){
      this.catService.getAllCategories()
      .subscribe(res => {
        this.loadedCats = res;
        console.log("Liste des catégories : ",this.loadedCats)
      });
    }
}
