import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from '../../services/attendance.service';
import { StudentService } from '../../services/student.service';
import { Attendance, AttendanceRequest, AttendanceStatus } from '../../models/attendance.model';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-form.component.html',
  styleUrls: ['./attendance-form.component.css']
})
export class AttendanceFormComponent implements OnInit {

  students: Student[] = [];
  attendance: AttendanceRequest = {
    studentId: 0,
    status: AttendanceStatus.PRESENT,
    remarks: ''
  };

  attendanceId: number | null = null;
  isEditMode = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  formErrors = {
    studentId: '',
    status: ''
  };

  constructor(
    private attendanceService: AttendanceService,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadAllStudents();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.attendanceId = +params['id'];
        this.loadAttendanceForEdit();
      }
    });
  }

  loadAllStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data) => { this.students = data; },
      error: (error) => { this.errorMessage = 'Failed to load students.'; }
    });
  }

  loadAttendanceForEdit(): void {
    if (this.attendanceId) {
      this.loading = true;
      this.attendanceService.getAttendanceById(this.attendanceId).subscribe({
        next: (data) => {
          this.attendance = {
            studentId: data.studentId,
            status: data.status,
            remarks: data.remarks || ''
          };
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load attendance.';
          this.loading = false;
        }
      });
    }
  }

  validateForm(): boolean {
    let isValid = true;
    this.formErrors = { studentId: '', status: '' };
    if (!this.attendance.studentId || this.attendance.studentId === 0) {
      this.formErrors.studentId = 'Select a student';
      isValid = false;
    }
    if (!this.attendance.status) {
      this.formErrors.status = 'Select status';
      isValid = false;
    }
    return isValid;
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.isEditMode && this.attendanceId) {
      this.attendanceService.updateAttendance(this.attendanceId, this.attendance).subscribe({
        next: () => {
          this.successMessage = 'Attendance updated successfully!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/attendance-list']), 2000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update attendance';
          this.loading = false;
        }
      });
    } else {
      this.attendanceService.markAttendance(this.attendance).subscribe({
        next: () => {
          this.successMessage = 'Attendance marked successfully!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/attendance-list']), 2000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to mark attendance';
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/attendance-list']);
  }

  resetForm(): void {
    this.attendance = {
      studentId: 0,
      status: AttendanceStatus.PRESENT,
      remarks: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.formErrors = { studentId: '', status: '' };
  }

  getStatusKeys() {
    return Object.keys(AttendanceStatus) as Array<keyof typeof AttendanceStatus>;
  }

  getStudentName(studentId: number): string {
    const student = this.students.find(s => s.studentId === studentId);
    return student ? student.studentName : '';
  }
}
