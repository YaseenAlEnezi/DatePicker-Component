import React, { useState } from 'react';

const App = () => {
  const [selectedYear, setSelectedYear] = useState(1990); // Default selected year
  const [selectedMonth, setSelectedMonth] = useState(1); // Default selected month
  const [selectedDay, setSelectedDay] = useState(1); // Default selected day

  const months = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1 to 31

  // Years range from 1900 to 2025
  const years = Array.from({ length: 126 }, (_, i) => 1900 + i); // 1900 to 2025

  const handleInfiniteScroll = (event, type) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 1 : -1;

    if (type === 'year') {
      setSelectedYear((prev) => {
        let newYear = prev + direction;
        // Wrap around if newYear goes below 1900 or above 2025
        if (newYear < 1900) newYear = 2025;
        if (newYear > 2025) newYear = 1900;
        return newYear;
      });
    } else if (type === 'month') {
      setSelectedMonth((prev) => (prev + direction + months.length) % months.length);
    } else if (type === 'day') {
      setSelectedDay((prev) => ((prev - 1 + direction + days.length) % days.length) + 1);
    }
  };

  const handleInfiniteDrag = (event, type) => {
    let startY = event.clientY;
    const moveHandler = (moveEvent) => {
      const diff = Math.floor((startY - moveEvent.clientY) / 30); // Sensitivity
      if (type === 'year') {
        setSelectedYear((prev) => {
          let newYear = prev + diff;
          // Wrap around if newYear goes below 1900 or above 2025
          if (newYear < 1900) newYear = 2025;
          if (newYear > 2025) newYear = 1900;
          return newYear;
        });
      } else if (type === 'month') {
        setSelectedMonth((prev) => (prev + diff + months.length) % months.length);
      } else if (type === 'day') {
        setSelectedDay((prev) => ((prev - 1 + diff + days.length) % days.length) + 1);
      }
    };
    const stopHandler = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', stopHandler);
    };
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', stopHandler);
  };

  const renderCenteredItems = (list, selectedIndex, type) => {
    const maxVisible = 5; // Number of visible items
    const half = Math.floor(maxVisible / 2);

    return Array.from({ length: maxVisible }).map((_, index) => {
      const infiniteIndex = (selectedIndex + index - half + list.length) % list.length;
      const item = list[infiniteIndex];
      const isSelected = index === half;
      return (
        <div
          key={`${type}-${index}-${item}`}
          className={`py-2 text-lg ${isSelected ? 'font-bold bg-yellow-100' : 'text-gray-500'} text-center`}
        >
          {item}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white shadow-lg space-y-4">
      <div className="flex justify-center space-x-4">
        <div
          className="w-24 text-center cursor-pointer select-none"
          onWheel={(e) => handleInfiniteScroll(e, 'year')}
          onMouseDown={(e) => handleInfiniteDrag(e, 'year')}
        >
          {renderCenteredItems(years, years.indexOf(selectedYear), 'year')}
        </div>
        <div
          className="w-24 text-center cursor-pointer select-none"
          onWheel={(e) => handleInfiniteScroll(e, 'month')}
          onMouseDown={(e) => handleInfiniteDrag(e, 'month')}
        >
          {renderCenteredItems(months, selectedMonth, 'month')}
        </div>
        <div
          className="w-24 text-center cursor-pointer select-none"
          onWheel={(e) => handleInfiniteScroll(e, 'day')}
          onMouseDown={(e) => handleInfiniteDrag(e, 'day')}
        >
          {renderCenteredItems(days, selectedDay - 1, 'day')}
        </div>
      </div>
      <button
        className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none"
        onClick={() => alert(`Selected Date: ${String(selectedDay).padStart(2, '0')} ${months[selectedMonth]} ${selectedYear}`)}
      >
        تم
      </button>
    </div>
  );
};

export default App;