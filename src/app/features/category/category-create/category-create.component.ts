import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent {
  file: any;
  loadedServices: any;
  categoryForm: FormGroup;
  selectedImage: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private router: Router,
    private imgService: ImageService,
    private catService: CategoryService,
    private fb:FormBuilder){

    this.categoryForm = this.fb.group({
      nomCategorie:'testcat',
      description:'desctest cat',
    })
  }

    ngOnInit(){}

    onFormSubmit(){
      if(this.categoryForm.valid){
        console.warn(this.categoryForm.value)
        this.catService.newCategorie(this.categoryForm.value)
        .subscribe({
          next :(res: any)=>{
            const categorieId = res
            console.log("cat créée",res)
            console.log("Categorie créée avec succès :)")
            console.log("Now registering marquee img...")

            if (!this.selectedImage) {
              console.log('Please select an image before uploading.:(');
              return;
            }

            const formData = new FormData();
            formData.append('fichier', this.selectedImage);
            formData.append('description', "Thumbnail cat "+categorieId);
            formData.append('categorieId', categorieId);
            console.log(formData.get('categorieId'));
            
            this.uploadImage(formData)
            .subscribe({
              next: (res: any)=>{
                console.log('Instance créée avec succès :).')
                alert("marqueur créé avec succès")
                this.router.navigate(['/dashboard/service/category/list'])
              },
              error: (err: any)=>{
                alert("erreur lors de création de la miniature du de la categorie")
                console.log("erreur lors de création de la miniature de la categorie", err)
              }
            })
          },
          error: (err: any)=>{
            alert("Unexpected error while registering the category"+err)
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
      return this.imgService.newCatImage(data);
    }
}
