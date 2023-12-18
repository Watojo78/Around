import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ImageService } from '../../../services/image.service';
import { ServiceService } from '../../../services/service.service';

@Component({
  selector: 'service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.scss']
})

export class ServiceCreateComponent {
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
    }

    onFormSubmit(){
      if(this.serviceForm.valid){
        console.warn(this.serviceForm.value)
        this.serService.newService(this.serviceForm.value)
        .subscribe({
          next :(serviceRes: any)=>{
            const serviceName = serviceRes.nomService
            console.log("Service créée avec succès :)")
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
