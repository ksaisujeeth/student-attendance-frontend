import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student, StudentRequest } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {

  // Form data
  student: StudentRequest = {
    studentName: '',
    studentClass: '',
    studentGender: ''
  };

  // Page state
  isEditMode = false;
  studentId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Form validation
  formErrors = {
    studentName: '',
    studentClass: '',
    studentGender: ''
  };

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check if we're editing existing student
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.studentId = +params['id']; // Convert string to number
        this.loadStudentForEdit();
      }
    });
  }

  // Load student data for editing
  loadStudentForEdit(): void {
    if (this.studentId) {
      this.loading = true;
      this.studentService.getStudentById(this.studentId).subscribe({
        next: (data) => {
          this.student = {
            studentName: data.studentName,
            studentClass: data.studentClass,
            studentGender: data.studentGender
          };
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load student details';
          this.loading = false;
          console.error('Error loading student:', error);
        }
      });
    }
  }

  // Validate form
  validateForm(): boolean {
    let isValid = true;
    
    // Reset errors
    this.formErrors = {
      studentName: '',
      studentClass: '',
      studentGender: ''
    };

    // Check student name
    if (!this.student.studentName || this.student.studentName.trim() === '') {
      this.formErrors.studentName = 'Student name is required';
      isValid = false;
    } else if (this.student.studentName.length < 2) {
      this.formErrors.studentName = 'Student name must be at least 2 characters';
      isValid = false;
    }

    // Check student class
    if (!this.student.studentClass || this.student.studentClass.trim() === '') {
      this.formErrors.studentClass = 'Student class is required';
      isValid = false;
    }

    // Check gender
    if (!this.student.studentGender) {
      this.formErrors.studentGender = 'Please select gender';
      isValid = false;
    }

    return isValid;
  }

  // Submit form
  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditMode && this.studentId) {
      // Update existing student
      this.studentService.updateStudent(this.studentId, this.student).subscribe({
        next: (data) => {
          this.loading = false;
          this.successMessage = 'Student updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/students']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Failed to update student';
          console.error('Error updating student:', error);
        }
      });
    } else {
      // Create new student
      this.studentService.createStudent(this.student).subscribe({
        next: (data) => {
          this.loading = false;
          this.successMessage = 'Student created successfully!';
          setTimeout(() => {
            this.router.navigate(['/students']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Failed to create student';
          console.error('Error creating student:', error);
        }
      });
    }
  }

  // Reset form
  resetForm(): void {
    this.student = {
      studentName: '',
      studentClass: '',
      studentGender: ''
    };
    this.formErrors = {
      studentName: '',
      studentClass: '',
      studentGender: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Go back to student list
  goBack(): void {
    this.router.navigate(['/students']);
  }
}
