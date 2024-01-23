import { ResetPasswordService } from './../../../services/reset-password.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Form, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ImageService } from '../../../services/image.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'user-account',
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit {
  id: any;
  user: any;
  profileId: any;
  userForm: FormGroup;
  isEditable!: boolean;
  initiateReset!: FormGroup;
  verifyOtp!: FormGroup;
  resetPassword!: FormGroup;
  selectedImage: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private router: Router,
    private userService: UserService,
    private imgService: ImageService,
    private reset: ResetPasswordService,
    private matSnackbar: MatSnackBar,
    private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      active: false,
      tel: '',
      numeroCni: '',
    })

    this.initiateReset = this.fb.group({
      email: ['', Validators.required]
    })

    this.verifyOtp = this.fb.group({
      email: ['', Validators.required],
      otp: ['', Validators.required]
    })

    this.resetPassword = this.fb.group({
      email: ['', Validators.required],
      otp: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.currentUser()
  }

  private currentUser() {
    this.userService.getCurrentUser()
      .subscribe({
        next: (res) => {
          this.user = res;
          this.id = res.id;
          this.userForm.patchValue(res)
          this.initiateReset.patchValue(res)
          this.verifyOtp.patchValue(res)
          this.resetPassword.patchValue(res)

          this.imgService.getAccountImage(this.user.id)
            .subscribe({
              next: (profile) => {
                this.profileId = profile?.id;
                const type = profile?.type;
                const url = profile?.donnees
                if (type && url) {
                  this.imageUrl = `data:${type};base64,${url}`;
                }
              },
              error: (err) => {
                console.log("Une erreur est survenue lors de la récupération du profil", err);
                this.matSnackbar.open("Une erreur est survenue lors de la récupération du profil", "Erreur profil", { duration: 5000 });
              }
            })
        },
        error: (err: any) => {
          console.log("Une erreur est survenue lors de la récupération de l'utilisateur connecté", err);
          this.matSnackbar.open("Une erreur est survenue lors de la récupération de l'utilisateur", "Fermer");
        }
      })
  }

  onFormSubmit() {
    if (this.userForm.valid) {
      console.warn(this.userForm.value)
      this.userService.updateUser(this.id, this.userForm.value)
        .subscribe({
          next: (res: any) => {
            const fullName = res.firstName + " " + res.lastName;
            this.matSnackbar.open("L'utilisateur a été mis  à jour avec succès", "Fermer", { duration: 5000 });
            console.log("Now updating profile img...")

            if (!this.selectedImage) {
              this.router.navigate(['/dashboard/user/list'])
              return;
            }

            const formData = new FormData();
            formData.append('fichier', this.selectedImage);
            formData.append('description', "Profil de " + fullName + " mis à jour");
            formData.append('compteId', this.id);
            console.log("Voici compteId", formData.get('compteId'));

            if (!this.profileId) {
              this.imgService.newAccountImage(formData)
                .subscribe({
                  next: (res: any) => {
                    console.log('Instance créée avec succès')
                    this.matSnackbar.open("Profil créé avec succès", "Fermer", { duration: 5000 });
                    this.router.navigate(['/dashboard/user/list'])
                    return;
                  },
                  error: (err: any) => {
                    console.log("Une erreur est survenue lors de la création du profil", err);
                    this.matSnackbar.open("Une erreur est survenue lors de la création du profil", "Fermer", { duration: 5000 });
                  }
                })
            }

            this.imgService.updateImage(this.profileId, formData)
              .subscribe({
                next: (res: any) => {
                  console.log('Instance modifiée avec succès :).')
                  this.matSnackbar.open("Profil maj avec succès", "Fermer", { duration: 5000 });
                  this.router.navigate(['/dashboard/user/list'])
                },
                error: (err: any) => {
                  this.matSnackbar.open("Une erreur est survenue lors de la maj du profil", "Fermer", { duration: 5000 });
                  console.log("erreur lors de la maj du profil", err)
                }
              })
          },
          error: (err: any) => {
            this.matSnackbar.open("Une erreur est survenue lors de la maj de l'utilisateur", "Fermer", { duration: 5000 });
            console.log("erreur de maj de l'utilisateur: ", err)
          }
        })
    }
  }

  startingReset() {
    if (!this.initiateReset.valid) {
      // Handle validation errors
      this.matSnackbar.open("Veuillez corriger les erreurs du formulaire", "Fermer", { duration: 5000 });
    }
    console.log("Starting reset...")
    this.reset.initiatePassReset(this.initiateReset.value.email)
      .subscribe({
        next: (responseText) => {
          // Handle plain text response
          const successMessage = responseText.substring(0, responseText.indexOf("\""));
          this.matSnackbar.open(successMessage, "Fermer", { duration: 5000 });
          console.log("Server response:", responseText);
        },
        error: (error) => {
          if (error instanceof ErrorEvent) {
            // Client-side or network error
            this.matSnackbar.open("Une erreur est survenue", "Fermer", { duration: 5000 });
          } else {
            // Server error (plain text message)
            this.matSnackbar.open("Server error"+error.error, "Fermer", { duration: 5000 });
          }
          console.error("Error:", error);
        }
      });
  }

  verifyOtpCode() {
    if (!this.verifyOtp.valid) {
      this.matSnackbar.open("Veuillez renseigner le code OTP", "Fermer", { duration: 5000 });
      return;
    }

    this.reset.verifyPassReset(this.verifyOtp.value)
      .subscribe({
        next: (res: any) => {
          this.matSnackbar.open("Code OTP vérifié avec succès", "Fermer", { duration: 5000 });
          console.log("", res)
        },
        error: (err: any) => {
          this.matSnackbar.open("Une erreur est survenue lors de la vérification du code OTP", "Fermer", { duration: 5000 });
          console.log("erreur lors de la vérification du code OTP", err)
        }
      })
  }

  processingReset() {
    if (!this.resetPassword.valid) {
      this.matSnackbar.open("Veuillez renseigner le code OTP et le nouveau mot de passe", "Fermer", { duration: 5000 });
      return;
    }

    this.reset.passReset(this.resetPassword.value)
      .subscribe({
        next: (res: any) => {
          this.matSnackbar.open("Mot de passe modifié avec succès", "Fermer", { duration: 5000 });
          console.log("", res)
        },
        error: (err: any) => {
          this.matSnackbar.open("Une erreur est survenue lors du changement de mot de passe", "Fermer", { duration: 5000 });
          console.log("erreur lors du changement de mot de passe", err)
        }
      })
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
}
