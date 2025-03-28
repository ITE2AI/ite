import React, { useState } from 'react';
import { GraduationCap, Users, Plus, Trash2 } from 'lucide-react';
import { useClass } from '../contexts/ClassContext';
import { useTheme } from '../contexts/ThemeContext';

export function ClassManager() {
  const { classes, addClass, removeClass, addStudent, removeStudent } = useClass();
  const { theme } = useTheme();
  const [newClassName, setNewClassName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    addClass(newClassName);
    setNewClassName('');
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedClassId) return;
    addStudent(selectedClassId, newStudentName);
    setNewStudentName('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5" style={{ color: theme.primaryColor }} />
            <h2 className="text-lg font-semibold">Gestione Classi</h2>
          </div>

          <form onSubmit={handleAddClass} className="flex gap-4 mb-6">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Nome classe (es. 3A)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
            />
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Plus className="h-4 w-4" />
              Aggiungi Classe
            </button>
          </form>

          <div className="space-y-4">
            {classes.map(c => (
              <div key={c.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">{c.name}</h3>
                    <span className="text-sm text-gray-500">
                      ({c.students.length} studenti)
                    </span>
                  </div>
                  <button
                    onClick={() => removeClass(c.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleAddStudent} className="flex gap-4 mb-4">
                  <input
                    type="text"
                    value={selectedClassId === c.id ? newStudentName : ''}
                    onChange={(e) => {
                      setSelectedClassId(c.id);
                      setNewStudentName(e.target.value);
                    }}
                    placeholder="Nome studente"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <Plus className="h-4 w-4" />
                    Aggiungi Studente
                  </button>
                </form>

                <div className="space-y-2">
                  {c.students.map(student => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{student.name}</span>
                      </div>
                      <button
                        onClick={() => removeStudent(c.id, student.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}