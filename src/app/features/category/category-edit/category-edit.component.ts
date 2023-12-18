import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ImageService } from '../../../services/image.service';
import { ServiceService } from '../../../services/service.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})

export class CategoryEditComponent {
  id!: number;
  file: any;
  categorieId: any;
  loadedServices: any;
  categoryForm: FormGroup;
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

    this.categoryForm = this.fb.group({
      nomCategorie:'',
      description:'',
      serviceIds: [""],
    })
  }

    ngOnInit(){
      this.fetchServices()
      this.route.params
        .subscribe((params: Params) => {
          this.id = +params['id'];
          this.imgService.getCatImage(this.id)
          .subscribe({
            next: (catThumb) => {
              const file = catThumb;
              if(file){
                console.log(this.imageUrl)
                this.imageUrl = file
              }
            },
            error: (err) => {
              console.log("La catégorie n'a aucune miniature", err)
            }
          })
          this.catService.getCategorie(this.id)
            .subscribe({
              next: (category) => {
                this.categoryForm.patchValue(category)
              },
              error: (error) => {
                if (error) {
                  // Redirect to dashboard if category not found
                  alert("La catégorie n'existe pas !!")
                  this.router.navigate(['/dashboard/service/category/list']);
                } else {
                  // Handle other errors
                  console.error('Unexpected error occurs while retrieving category:', error);
                }
              },
            });
        });
    }

    onFormSubmit(){
      if(this.categoryForm.valid){
        console.warn(this.categoryForm.value)
        this.catService.newCategorie(this.categoryForm.value)
        .subscribe({
          next :(res: any)=>{
            const categoryName = res.nomCategorie
            console.log("Categorie créée avec succès :)")
            console.log("Now registering profile img...")

            if (!this.selectedImage) {
              console.log('Please select an image before uploading.:(');
              return;
            }

            const formData = new FormData();
            formData.append('fichier', this.selectedImage);
            formData.append('description', "Thumbnail service:"+categoryName);
            formData.append('categorieId', this.categorieId);
            console.log(formData.get('categorieId'));
            
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

    private fetchServices(){
      this.serService.getAllServices()
      .subscribe(res => {
        this.loadedServices = res;
        console.log("Liste des catégories : ",this.loadedServices)
      });
    }
}
