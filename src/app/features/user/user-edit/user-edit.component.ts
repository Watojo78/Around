import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { RoleService } from '../../../services/role.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  user: any;
  id!: number;
  fName!: string;
  lName!: string;
  loadedRoles : any;
  userForm: FormGroup;
  selectedImage: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;
  
  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private imgService: ImageService,
    private roleService: RoleService,
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
      this.fetchRoles()
      this.route.params
        .subscribe((params: Params) => {
          this.id = +params['id'];
          this.imgService.getAccountImage(this.id)
          .subscribe({
            next: (profile) => {
              const file = profile;
              console.log(file)
              if(file){
                this.selectedImage = file;
                this.previewImage(file);
              }
            },
            error: (err) => {
              console.log("La catégorie n'a aucune miniature", err)
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
                }
              },
            });
        });
    }

    onFormSubmit(){
      if(this.userForm.valid){
        console.warn(this.userForm.value)
        this.userService.updateUser(this.id, this.userForm.value)
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
              formData.append('description', "profil utilisateur de"+fullName);
              formData.append('compteId', compteId);
              console.log(formData.get('compteId'));
              this.updateProfile(this.id, formData)
              .subscribe({
                next: (res: any)=>{
                  console.log('Instance créée avec succès :).')
                  alert("profil maj avec succès")
                  this.router.navigate(['/dashboard/user/list'])
                },
                error: (err: any)=>{
                  alert("erreur lors de la maj du profil")
                  console.log("erreur lors de la maj du profil", err)
                }
              })
            },
            error: (err: any)=>{
              alert("erreur lors de la maj de l'utilisateur")
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

    private updateProfile(id:number, data: any){
      return this.imgService.updateImage(id, data);
    }
  
    private fetchRoles(){
      this.roleService.getAllRoles()
      .subscribe(res => {
        this.loadedRoles = res;
        console.log("Liste des rôles : ",this.loadedRoles)
      });
    }
}
