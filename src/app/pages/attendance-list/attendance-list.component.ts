import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from '../../services/attendance.service';
import { StudentService } from '../../services/student.service';
import { Attendance, AttendanceStatus } from '../../models/attendance.model';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit {

  attendances: Attendance[] = [];
  students: Student[] = [];
  loading = false;
  errorMessage = '';
  
  // For filtering by student
  selectedStudentId: number | null = null;
  selectedStudentName = '';
  isStudentSpecific = false;

  constructor(
    private attendanceService: AttendanceService,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check if we're viewing attendance for specific student
    this.route.params.subscribe(params => {
      if (params['type'] === 'student' && params['id']) {
        this.selectedStudentId = +params['id'];
        this.isStudentSpecific = true;
        this.loadStudentAttendances();
        this.loadStudentName();
      } else {
        this.loadAllAttendances();
      }
    });
    
    this.loadAllStudents();
  }

  loadAllAttendances(): void {
    this.loading = true;
    this.attendanceService.getAllAttendances().subscribe({
      next: (data) => {
        this.attendances = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load attendance records';
        this.loading = false;
        console.error('Error loading attendances:', error);
      }
    });
  }

  loadStudentAttendances(): void {
    if (this.selectedStudentId) {
      this.loading = true;
      this.attendanceService.getAttendancesForStudent(this.selectedStudentId).subscribe({
        next: (data) => {
          this.attendances = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load student attendance records';
          this.loading = false;
          console.error('Error loading student attendances:', error);
        }
      });
    }
  }

  loadAllStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });
  }

  loadStudentName(): void {
    if (this.selectedStudentId) {
      this.studentService.getStudentById(this.selectedStudentId).subscribe({
        next: (data) => {
          this.selectedStudentName = data.studentName;
        },
        error: (error) => {
          console.error('Error loading student name:', error);
        }
      });
    }
  }

  getStudentName(studentId: number): string {
    const student = this.students.find(s => s.studentId === studentId);
    return student ? student.studentName : 'Unknown';
  }

  getStatusBadgeClass(status: AttendanceStatus): string {
    return status === AttendanceStatus.PRESENT ? 'badge bg-success' : 'badge bg-danger';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  markNewAttendance(): void {
    this.router.navigate(['/attendance-form']);
  }

  editAttendance(attendanceId: number): void {
    this.router.navigate(['/attendance-form', attendanceId]);
  }

  deleteAttendance(attendanceId: number, studentName: string, date: string): void {
    if (confirm(`Are you sure you want to delete attendance record for ${studentName} on ${this.formatDate(date)}?`)) {
      this.attendanceService.deleteAttendance(attendanceId).subscribe({
        next: () => {
          if (this.isStudentSpecific) {
            this.loadStudentAttendances();
          } else {
            this.loadAllAttendances();
          }
          alert('Attendance record deleted successfully!');
        },
        error: (error) => {
          alert('Failed to delete attendance record');
          console.error('Error deleting attendance:', error);
        }
      });
    }
  }

  viewStudentProfile(studentId: number): void {
    this.router.navigate(['/students']);
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }

  viewReports(): void {
    this.router.navigate(['/reports']);
  }
}
