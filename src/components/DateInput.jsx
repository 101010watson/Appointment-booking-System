import React, { useState } from 'react';

export const DateInput = ({ label, value, onChange, required = false }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState('01');
  const [day, setDay] = useState('01');

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const handleDateChange = (newYear, newMonth, newDay) => {
    const dateString = `${newYear}-${newMonth}-${newDay}`;
    onChange({ target: { value: dateString } });
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setYear(newYear);
    handleDateChange(newYear, month, day);
  };

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    handleDateChange(year, newMonth, day);
  };

  const handleDayChange = (e) => {
    const newDay = e.target.value;
    setDay(newDay);
    handleDateChange(year, month, newDay);
  };

  const daysInMonth = getDaysInMonth(parseInt(year), parseInt(month));
  const days = Array.from({ length: daysInMonth }, (_, i) => 
    (i + 1).toString().padStart(2, '0')
  );

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex space-x-2">
        <select
          value={year}
          onChange={handleYearChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        
        <select
          value={month}
          onChange={handleMonthChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        >
          {months.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        
        <select
          value={day}
          onChange={handleDayChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        >
          {days.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD</p>
    </div>
  );
};
