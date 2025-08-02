export interface Student {
  studentId?: number;
  studentName: string;
  studentClass: string;
  studentGender: string;
}

export interface StudentRequest {
  studentName: string;
  studentClass: string;
  studentGender: string;
}
