import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { RoleService } from '../../../services/role.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImageService } from '../../../services/image.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  user: any;
  id: any;
  profileId: any;
  roles: any;
  currentUserId!: number;
  fName!: string;
  lName!: string;
  loadedRoles : any;
  userForm: FormGroup;
  isEditable!: boolean;
  selectedImage: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;
  
  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private imgService: ImageService,
    private roleService: RoleService,
    private matSnackbar: MatSnackBar,
    private fb:FormBuilder){
      this.userForm = this.fb.group({
        firstName:'',
        lastName:'',
        password:'',
        email:'',
        active: false,
        tel:'',
        numeroCni:'',
        roleId: 0,
      })
    }

    ngOnInit() {
      this.getCurrentUser()
      this.fetchRoles()
      this.route.params
        .subscribe((params: Params) => {
          this.id = +params['id'];
          this.isEditable = this.id !== this.currentUserId;

          this.imgService.getAccountImage(this.id)
          .subscribe({
            next: (profile) => {
              this.profileId = profile?.id;
              const type = profile?.type;
              const url = profile?.donnees
              if(type && url){
                this.imageUrl = `data:${type};base64,${url}`;
              }
            },
            error: (err) => {
              console.log("Une erreur est survenue lors de la récupération du profil", err);
              this.matSnackbar.open("Une erreur est survenue lors de la récupération du profil", "Erreur profil", {duration: 5000});
            }
          })

          this.userService.getUser(this.id)
            .subscribe({
              next: (user) => {
                this.user = user;
                this.fName = user.firstName;
                this.lName= user.lastName;
                this.userForm.patchValue(this.user)
              },
              error: (error) => {
                if (error) {
                  // Redirect to dashboard if user not found
                  alert("L'utilisateur n'existe pas !!")
                  this.router.navigate(['/dashboard/user/list']);
                } else {
                  // Handle other errors
                  console.error('Error retrieving user:', error);
                  this.matSnackbar.open("Une erreur est survenue lors de la récupération de l'utilisateur", "Fermer", {duration: 5000});
                }
              },
            });
        });
    }

    

  private getCurrentUser(){
    this.userService.getCurrentUser()
    .subscribe({
      next: (user) => {
        this.currentUserId = user.id;
      },
      error: (error) => {
        if (error) {
          // Redirect to dashboard if user not found
          alert("L'utilisateur n'existe pas !!")
          this.router.navigate(['/dashboard/user/list']);
        } else {
          // Handle other errors
          console.error('Error retrieving user:', error);
        }
      },
    });
  }

    onFormSubmit(){
      if(this.userForm.valid){
        console.warn(this.userForm.value)
        this.userService.updateUser(this.id, this.userForm.value)
          .subscribe({
            next :(res: any)=>{
              const fullName = res.firstName + " " + res.lastName;
              this.matSnackbar.open("L'utilisateur a été mis  à jour avec succès", "Fermer", {duration: 5000});
              console.log("Now updating profile img...")
  
              if (!this.selectedImage) {
                this.router.navigate(['/dashboard/user/list'])
                return;
              }
        
              const formData = new FormData();
              formData.append('fichier', this.selectedImage);
              formData.append('description', "Profil de "+fullName+" mis à jour");
              formData.append('compteId', this.id);
              console.log("Voici compteId", formData.get('compteId'));

              if(!this.profileId){
                this.imgService.newAccountImage(formData)
                .subscribe({
                  next: (res: any)=>{
                    console.log('Instance créée avec succès')
                    this.matSnackbar.open("Profil créé avec succès", "Fermer", {duration: 5000});
                    this.router.navigate(['/dashboard/user/list'])
                  },
                  error: (err: any)=>{
                    console.log("Une erreur est survenue lors de la création du profil", err);
                    this.matSnackbar.open("Une erreur est survenue lors de la création du profil", "Fermer", {duration: 5000});
                  }
                })
              }

              this.imgService.updateImage(this.profileId, formData)
              .subscribe({
                next: (res: any)=>{
                  console.log('Instance modifiée avec succès :).')
                  this.matSnackbar.open("Profil maj avec succès", "Fermer", {duration: 5000});
                  this.router.navigate(['/dashboard/user/list'])
                },
                error: (err: any)=>{
                  this.matSnackbar.open("Une erreur est survenue lors de la maj du profil", "Fermer", {duration: 5000});
                  console.log("erreur lors de la maj du profil", err)
                }
              })
            },
            error: (err: any)=>{
              this.matSnackbar.open("Une erreur est survenue lors de la maj de l'utilisateur", "Fermer", {duration: 5000});
              console.log("erreur de maj de l'utilisateur: ", err)
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
        console.log(this.selectedImage)
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
  
    private fetchRoles(){
      this.roleService.getAllRoles()
      .subscribe(res => {
        this.loadedRoles = res;
        console.log("Liste des rôles : ",this.loadedRoles)
      });
    }
}
