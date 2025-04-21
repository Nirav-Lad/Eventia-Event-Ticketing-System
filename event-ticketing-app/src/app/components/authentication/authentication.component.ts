// src/app/components/authentication/authentication.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
  isLoginMode = true;
  user = { email: '', password: '', name: '', role: 'user' };  // role = user or organizer

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.authService.login(this.user).subscribe({
        next: (response: any) => {
          console.log('Login response:', response); // Add logging
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('userId', response.userId);

          console.log('Logged in as:', response.role);
  
          // Check the role and navigate
          if (response.role === 'user') {
            console.log('Redirecting to home page...');
            this.router.navigate(['/home']);  // Ensure correct route is used here
          } else {
            console.log('Redirecting to organizer events page...');
            this.router.navigate(['/organizer-events']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          alert('Invalid credentials. Please try again.');
        }
      });
    }
  }
  
}
