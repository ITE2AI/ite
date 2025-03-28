import React, { createContext, useContext, useState, useEffect } from 'react';
import { Class, Student } from '../types';

interface ClassContextType {
  classes: Class[];
  addClass: (name: string) => void;
  removeClass: (id: string) => void;
  addStudent: (classId: string, name: string) => void;
  removeStudent: (classId: string, studentId: string) => void;
  getClassName: (classId: string) => string;
  getStudent: (studentId: string) => Student | undefined;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<Class[]>(() => {
    const savedClasses = localStorage.getItem('classes');
    return savedClasses ? JSON.parse(savedClasses) : [];
  });

  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  const addClass = (name: string) => {
    const newClass: Class = {
      id: Date.now().toString(),
      name,
      students: []
    };
    setClasses([...classes, newClass]);
  };

  const removeClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const addStudent = (classId: string, name: string) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      classId
    };

    setClasses(classes.map(c => 
      c.id === classId 
        ? { ...c, students: [...c.students, newStudent] }
        : c
    ));
  };

  const removeStudent = (classId: string, studentId: string) => {
    setClasses(classes.map(c => 
      c.id === classId 
        ? { ...c, students: c.students.filter(s => s.id !== studentId) }
        : c
    ));
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || '';
  };

  const getStudent = (studentId: string) => {
    for (const c of classes) {
      const student = c.students.find(s => s.id === studentId);
      if (student) return student;
    }
    return undefined;
  };

  return (
    <ClassContext.Provider value={{ 
      classes, 
      addClass, 
      removeClass, 
      addStudent, 
      removeStudent,
      getClassName,
      getStudent
    }}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClass() {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClass must be used within a ClassProvider');
  }
  return context;
}