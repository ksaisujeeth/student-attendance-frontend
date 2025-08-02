import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  students: Student[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private studentService: StudentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllStudents();
  }

  // Get all students from backend
  loadAllStudents(): void {
    this.loading = true;
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load students';
        this.loading = false;
        console.error('Error loading students:', error);
      }
    });
  }

  // Navigate to add new student page
  addNewStudent(): void {
    this.router.navigate(['/student-form']);
  }

  // Navigate to edit student page
  editStudent(studentId: number): void {
    this.router.navigate(['/student-form', studentId]);
  }

  // Delete student
  deleteStudent(studentId: number, studentName: string): void {
    if (confirm(`Are you sure you want to delete ${studentName}?`)) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: () => {
          this.loadAllStudents(); // Refresh the list
          alert('Student deleted successfully!');
        },
        error: (error) => {
          alert('Failed to delete student');
          console.error('Error deleting student:', error);
        }
      });
    }
  }

  // View student attendance
  viewAttendance(studentId: number): void {
    this.router.navigate(['/attendance-list', 'student', studentId]);
  }
}
