import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageService } from '../../../services/image.service';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})

export class UserCreateComponent {
  file: any;
  compteId: any;
  loadedRoles : any;
  userForm:FormGroup;
  selectedImage: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private router: Router,
    private imgService: ImageService,
    private userService: UserService, 
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private fb:FormBuilder){

    this.userForm = this.fb.group({
      firstName:'',
      lastName:'',
      password:'',
      email:'',
      active: false,
      tel: 0,
      numeroCni:'',
      roleId: 0,
    })
  }

  ngOnInit(){
    this.fetchRoles()
  }

  onFormSubmit(){
    if(this.userForm.valid){
      console.warn(this.userForm.value)
      this.userService.newUser(this.userForm.value)
        .subscribe({
          next :(res: any)=>{
            const tokenParts = res.token.split('.');
            const payloadBase64 = tokenParts[1];
            const payloadJson = JSON.parse(atob(payloadBase64));
            const compteId = payloadJson.compteId; // Extract compteId from response
            const fullName = payloadJson.fullName;

            console.log("Now registering profile img...")

            if (!this.selectedImage) {
              console.log('Please select an image before uploading.:(');
              return;
            }

            const formData = new FormData();
            formData.append('fichier', this.selectedImage);
            formData.append('description', "profil utilisateur de "+fullName);
            formData.append('compteId', compteId);
            console.log(formData.get('description'));
            console.log(formData.get('fichier'))
            this.uploadImage(formData)
            .subscribe({
              next: (res: any)=>{
                console.log('Instance créée avec succès :).')
                this.snackBar.open(
                  this.formatSnackbar('User 100% created successfully!', 'Created', 'User'),
                  '',
                  {
                    duration: 3000,
                    panelClass: ['success-snackbar'] // Optional custom CSS class
                  }
                );
              },
              error: (err: any)=>{
                alert("erreur lors de création du profil")
                console.log("Erreur lors de création du profil", err)
              }
            })
          },
          error: (err: any)=>{
            this.snackBar.open(
              this.formatSnackbar('Error creating user: ' + err.message, 'Error', 'User'),
              '',
              {
                duration: 5000,
                panelClass: ['error-snackbar'] // Optional custom CSS class
              }
            );
            console.log("erreur d'enregistrement: ", err.message)
          }
        })
    }
  }

  private formatSnackbar(message: string, action: string, entityName: string): string {
    return `${action.toUpperCase()} ${entityName}: ${message}`;
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
      console.log(this.selectedImage)
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.imageUrl = reader.result;
    };
  }

  private uploadImage(data: any) {
    return this.imgService.newAccountImage(data);
  }

  private fetchRoles(){
    this.roleService.getAllRoles()
    .subscribe(res => {
      this.loadedRoles = res;
      console.log("Liste des rôles : ",this.loadedRoles)
    });
  }

}
