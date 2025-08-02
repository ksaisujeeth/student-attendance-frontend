import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  selectedDate: string = '';
  presentStudents: string[] = [];
  loading = false;
  errorMessage = '';
  searched = false;

  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    // Default date to today
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  getPresentStudents(): void {
    if (!this.selectedDate) return;

    this.loading = true;
    this.presentStudents = [];
    this.errorMessage = '';
    this.searched = false;

    this.attendanceService.getPresentStudentsByDate(this.selectedDate).subscribe({
      next: (names) => {
        this.presentStudents = names;
        this.searched = true;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Could not fetch attendance data';
        this.loading = false;
        this.searched = true;
      }
    });
  }
}
