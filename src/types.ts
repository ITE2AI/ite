export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'staff';
  password: string;
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
}

export interface Student {
  id: string;
  name: string;
  classId: string;
}

export interface StudentBreak {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  startTime: Date;
  endTime?: Date;
  registeredBy: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
}

export interface NewUser {
  email: string;
  name: string;
  role: 'teacher' | 'staff';
  password: string;
}

export interface BreakReport {
  totalBreaks: number;
  averageDuration: number;
  breaksByStudent: {
    [studentId: string]: {
      count: number;
      totalDuration: number;
      studentName: string;
      className: string;
    };
  };
}