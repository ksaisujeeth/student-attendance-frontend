export interface Attendance {
  attendanceId?: number;
  studentId: number;
  status: AttendanceStatus;
  remarks?: string;
  createdAt?: string;
}

export interface AttendanceRequest {
  studentId: number;
  status: AttendanceStatus;
  remarks?: string;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT'
}
