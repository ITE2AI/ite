import React, { useState, useMemo } from 'react';
import { BarChart, Clock, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { StudentBreak, BreakReport } from '../types';
import { startOfWeek, endOfWeek, isWithinInterval, startOfDay, endOfDay, Locale } from 'date-fns';
import it from 'date-fns/locale/it';

interface Props {
  breaks: StudentBreak[];
}

export function BreakReports({ breaks }: Props) {
  const { theme } = useTheme();
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily');

  const generateReport = (filteredBreaks: StudentBreak[]): BreakReport => {
    const report: BreakReport = {
      totalBreaks: filteredBreaks.length,
      averageDuration: 0,
      breaksByStudent: {}
    };

    let totalDuration = 0;
    let completedBreaks = 0;

    filteredBreaks.forEach(breakItem => {
      if (!report.breaksByStudent[breakItem.studentId]) {
        report.breaksByStudent[breakItem.studentId] = {
          count: 0,
          totalDuration: 0,
          studentName: breakItem.studentName,
          className: breakItem.className
        };
      }

      report.breaksByStudent[breakItem.studentId].count++;

      if (breakItem.endTime) {
        const duration = (new Date(breakItem.endTime).getTime() - new Date(breakItem.startTime).getTime()) / 1000 / 60;
        report.breaksByStudent[breakItem.studentId].totalDuration += duration;
        totalDuration += duration;
        completedBreaks++;
      }
    });

    report.averageDuration = completedBreaks > 0 ? totalDuration / completedBreaks : 0;

    return report;
  };

  const report = useMemo(() => {
    const now = new Date();
    let filteredBreaks: StudentBreak[];

    if (reportType === 'weekly') {
      const weekStart = startOfWeek(now, { locale: it });
      const weekEnd = endOfWeek(now, { locale: it });
      filteredBreaks = breaks.filter(b => 
        isWithinInterval(new Date(b.startTime), { start: weekStart, end: weekEnd })
      );
    } else {
      const dayStart = startOfDay(now);
      const dayEnd = endOfDay(now);
      filteredBreaks = breaks.filter(b => 
        isWithinInterval(new Date(b.startTime), { start: dayStart, end: dayEnd })
      );
    }

    return generateReport(filteredBreaks);
  }, [breaks, reportType]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5" style={{ color: theme.primaryColor }} />
            <h2 className="text-lg font-semibold">Report Uscite</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReportType('daily')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                reportType === 'daily' 
                  ? 'text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={reportType === 'daily' ? { backgroundColor: theme.primaryColor } : {}}
            >
              Giornaliero
            </button>
            <button
              onClick={() => setReportType('weekly')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                reportType === 'weekly' 
                  ? 'text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={reportType === 'weekly' ? { backgroundColor: theme.primaryColor } : {}}
            >
              Settimanale
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Totale Uscite</span>
            </div>
            <span className="text-2xl font-bold">{report.totalBreaks}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Durata Media</span>
            </div>
            <span className="text-2xl font-bold">
              {report.averageDuration.toFixed(1)} min
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(report.breaksByStudent).map(([studentId, data]) => (
            <div key={studentId} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium">{data.studentName}</span>
                  <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full"
                        style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}>
                    {data.className}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {data.count} uscite
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Durata media: {(data.totalDuration / data.count).toFixed(1)} min
              </div>
            </div>
          ))}

          {Object.keys(report.breaksByStudent).length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Nessuna uscita registrata in questo periodo
            </div>
          )}
        </div>
      </div>
    </div>
  );
}