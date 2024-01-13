import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ImageService } from '../../../services/image.service';
import { ServiceService } from '../../../services/service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})

export class CategoryEditComponent {
  id!: number;
  file: any;
  categorieId: any;
  catName!: string;
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
    private matSnackbar: MatSnackBar,
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
              const type = catThumb.type;
              const url = catThumb.donnees
              if(type && url){
                this.imageUrl = `data:${type};base64,${url}`;
              }
            },
            error: (err) => {
              console.log("Une erreur est survenue lors de la récupération de la miniature", err.message)
              this.matSnackbar.open("Une erreur est survenue lors de la récupération du profil", "Erreur profil", {duration: 5000});
            }
          })
          this.catService.getCategorie(this.id)
            .subscribe({
              next: (category) => {
                this.catName = category.nomCategorie;
                this.categoryForm.patchValue(category)
              },
              error: (error) => {
                if (error) {
                  // Redirect to dashboard if category not found
                  alert("La catégorie n'existe pas !!")
                  this.router.navigate(['/dashboard/service/category/list']);
                } else {
                  // Handle other errors
                  console.error('Unexpected error occurs while retrieving category:', error.message);
                  this.matSnackbar.open("Une erreur est survenue lors de la récupération de la catégorie", "Erreur catégorie", {duration: 5000});
                }
              },
            });
        });
    }

    onFormSubmit(){
      if(this.categoryForm.valid){
        console.warn(this.categoryForm.value)
        this.catService.updateCategorie(this.id, this.categoryForm.value)
        .subscribe({
          next :(res: any)=>{
            const categoryName = res.nomCategorie

            console.log("Categorie Maj avec succès :)")
            this.matSnackbar.open("Catégorie mise à jour avec succès", "Succès", {duration: 5000});
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
            
            this.updateThumbnail(this.id, formData)
            .subscribe({
              next: (res: any)=>{
                console.log('Miniature maj avec avec succès :).')
                this.matSnackbar.open("Miniature Maj avec succès", "Succès", {duration: 5000});
                this.router.navigate(['/dashboard/user/list'])
              },
              error: (err: any)=>{
                alert("erreur lors de Maj de la miniature du service")
                console.log("erreur lors de Maj de la miniature du service", err)
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
  
    private previewImage(file: File): void {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
  
    private updateThumbnail(id:number, data: any) {
      return this.imgService.updateImage(id, data);
    }

    private fetchServices(){
      this.serService.getAllServices()
      .subscribe(res => {
        this.loadedServices = res;
        console.log("Liste des catégories : ",this.loadedServices)
      });
    }
}
