import React, { useState, useEffect } from 'react';

export const TimeInput = ({ label, value, onChange, required = false }) => {
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  // Set initial time when component mounts
  useEffect(() => {
    handleTimeChange('09', '00', 'AM');
  }, []);

  const handleTimeChange = (newHour, newMinute, newPeriod) => {
    let hour24 = parseInt(newHour);
    if (newPeriod === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (newPeriod === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${newMinute}`;
    onChange({ target: { value: timeString } });
  };

  const handleHourChange = (e) => {
    const newHour = e.target.value;
    setHour(newHour);
    handleTimeChange(newHour, minute, period);
  };

  const handleMinuteChange = (e) => {
    const newMinute = e.target.value;
    setMinute(newMinute);
    handleTimeChange(hour, newMinute, period);
  };

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    setPeriod(newPeriod);
    handleTimeChange(hour, minute, newPeriod);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex space-x-2">
        <select
          value={hour}
          onChange={handleHourChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const h = (i + 1).toString().padStart(2, '0');
            return <option key={h} value={h}>{h}</option>;
          })}
        </select>
        
        <span className="flex items-center text-gray-500">:</span>
        
        <select
          value={minute}
          onChange={handleMinuteChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        >
          <option value="00">00</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
        </select>
        
        <select
          value={period}
          onChange={handlePeriodChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <p className="text-xs text-gray-500 mt-1">Time will be: {hour}:{minute} {period}</p>
    </div>
  );
};
