import React, { useState } from 'react';
import { Clock, UserCheck, UserMinus } from 'lucide-react';
import { StudentBreak } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useClass } from '../contexts/ClassContext';
import { BreakReports } from './BreakReports';

export function BathroomBreakManager() {
  const [breaks, setBreaks] = useState<StudentBreak[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const { user } = useAuth();
  const { theme } = useTheme();
  const { classes, getClassName, getStudent } = useClass();

  const addBreak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !user) return;

    const student = getStudent(selectedStudentId);
    if (!student) return;

    const newBreak: StudentBreak = {
      id: Date.now().toString(),
      studentId: student.id,
      studentName: student.name,
      className: getClassName(student.classId),
      startTime: new Date(),
      registeredBy: user.id
    };

    setBreaks([...breaks, newBreak]);
    setSelectedStudentId('');
  };

  const returnStudent = (id: string) => {
    setBreaks(breaks.map(b => 
      b.id === id ? { ...b, endTime: new Date() } : b
    ));
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateDuration = (start: Date, end: Date) => {
    const diff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000 / 60);
    return `${diff} min`;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addBreak} className="flex gap-4">
        <select
          value={selectedClassId}
          onChange={(e) => {
            setSelectedClassId(e.target.value);
            setSelectedStudentId('');
          }}
          className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
        >
          <option value="">Seleziona classe</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
          disabled={!selectedClassId}
        >
          <option value="">Seleziona studente</option>
          {classes
            .find(c => c.id === selectedClassId)
            ?.students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
        </select>

        <button
          type="submit"
          disabled={!selectedStudentId}
          className="px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: theme.primaryColor }}
        >
          Registra Uscita
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {breaks.map(b => (
              <div key={b.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {b.endTime ? (
                    <UserCheck className="text-green-500" size={24} />
                  ) : (
                    <UserMinus className="text-orange-500" size={24} />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{b.studentName}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}>
                        {b.className}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>Uscita: {formatTime(b.startTime)}</span>
                      {b.endTime && (
                        <>
                          <span>• Rientro: {formatTime(b.endTime)}</span>
                          <span>• Durata: {calculateDuration(b.startTime, b.endTime)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {!b.endTime && (
                  <button
                    onClick={() => returnStudent(b.id)}
                    className="px-4 py-2 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: '#22c55e' }}
                  >
                    Rientro
                  </button>
                )}
              </div>
            ))}

            {breaks.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nessuno studente è attualmente in bagno
              </div>
            )}
          </div>
        </div>

        <BreakReports breaks={breaks} />
      </div>
    </div>
  );
}