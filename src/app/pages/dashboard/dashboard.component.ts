import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { AttendanceService } from '../../services/attendance.service';
import { Student } from '../../models/student.model';
import { Attendance, AttendanceStatus } from '../../models/attendance.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalStudents = 0;
  todaysPresentCount = 0;
  todaysAbsentCount = 0;
  today = new Date().toISOString().split('T')[0];
  loading = false;
  errorMessage = '';

  constructor(
    private studentService: StudentService,
    private attendanceService: AttendanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts(): void {
    this.loading = true;
    // Get total students
    this.studentService.getAllStudents().subscribe({
      next: (students: Student[]) => {
        this.totalStudents = students.length;
      },
      error: () => {
        this.errorMessage = 'Could not load students';
        this.loading = false;
      }
    });

    // Get today's attendance (present students)
    this.attendanceService.getPresentStudentsByDate(this.today).subscribe({
      next: (studentNames: string[]) => {
        this.todaysPresentCount = studentNames.length;
        // Make API call to get today's total attendance and calculate absents
        this.attendanceService.getAllAttendances().subscribe({
          next: (allAttendance: Attendance[]) => {
            const todayAttendance = allAttendance.filter(a => a.createdAt?.startsWith(this.today));
            const absents = todayAttendance.filter(a => a.status === AttendanceStatus.ABSENT).length;
            this.todaysAbsentCount = absents;
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'Could not load attendance';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Could not load attendance';
        this.loading = false;
      }
    });
  }

  gotoStudents(): void {
    this.router.navigate(['/students']);
  }

  gotoAttendance(): void {
    this.router.navigate(['/attendance-list']);
  }

  gotoReports(): void {
    this.router.navigate(['/reports']);
  }
}
