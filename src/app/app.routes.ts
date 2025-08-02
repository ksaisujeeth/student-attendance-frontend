import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { StudentFormComponent } from './pages/student-form/student-form.component';
import { AttendanceListComponent } from './pages/attendance-list/attendance-list.component';
import { AttendanceFormComponent } from './pages/attendance-form/attendance-form.component';
import { ReportsComponent } from './pages/reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'student-form', component: StudentFormComponent },
  { path: 'student-form/:id', component: StudentFormComponent },
  { path: 'attendance-list', component: AttendanceListComponent },
  { path: 'attendance-list/:type/:id', component: AttendanceListComponent },
  { path: 'attendance-form', component: AttendanceFormComponent },
  { path: 'attendance-form/:id', component: AttendanceFormComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '**', redirectTo: '/dashboard' }
];
