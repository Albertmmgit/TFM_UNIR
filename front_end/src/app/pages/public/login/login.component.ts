import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth-service.service';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('Respuesta completa del servidor:', response);

          if (response && response.user) {
            console.log('Usuario encontrado:', response.user);

            // Almacenar la información del usuario en el almacenamiento local
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);



            // Redirigir según el rol del usuario
            switch (response.user.role) {
              case 1: // Admin
                this.router.navigate(['/admin']);
                break;
              case 2: // Teacher
                this.router.navigate(['/teacher']);
                break;
              case 3: // Student
                this.router.navigate(['/student']);
                break;
              default:
                this.router.navigate(['/']);
            }
          } else {
            console.error('La respuesta no contiene la propiedad user.');
          }
        },
        error: (error: any) => {
          console.error('Error en el inicio de sesión:', error);
          if (error.status === 401) {
            this.errorMessage = 'Credenciales inválidas. Por favor, inténtelo de nuevo.';
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.';
          }
        },
        complete: () => {
          console.log('Petición de inicio de sesión completada');
        }
      });
    }
  }
}
