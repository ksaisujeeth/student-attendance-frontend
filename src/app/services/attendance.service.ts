import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance, AttendanceRequest } from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private baseUrl = 'http://localhost:8080/api/attendance';

  constructor(private http: HttpClient) { }

  // Mark attendance
  markAttendance(attendance: AttendanceRequest): Observable<Attendance> {
    return this.http.post<Attendance>(this.baseUrl, attendance);
  }

  // Get all attendance records
  getAllAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.baseUrl);
  }

  // Get attendance by ID
  getAttendanceById(id: number): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.baseUrl}/${id}`);
  }

  // Get attendance for specific student
  getAttendancesForStudent(studentId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/student/${studentId}`);
  }

  // Update attendance
  updateAttendance(id: number, attendance: AttendanceRequest): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.baseUrl}/${id}`, attendance);
  }

  // Delete attendance
  deleteAttendance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Get present students by date
  getPresentStudentsByDate(date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/present-student-names-by-date?date=${date}`);
  }
}
