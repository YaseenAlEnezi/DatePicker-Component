import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

const DatePicker = ({
  lang = "ar",
  selectedDate,
  onDateChange,
  className,
  ...props
}) => {
  const [selectedYear, setSelectedYear] = useState(selectedDate.year());
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.month());
  const [selectedDay, setSelectedDay] = useState(selectedDate.date());

  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);

  const dragState = useRef({ type: null, startY: 0 });

  const months =
    lang === "en"
      ? [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]
      : [
          "كانون الثاني",
          "شباط",
          "آذار",
          "نيسان",
          "أيار",
          "حزيران",
          "تموز",
          "آب",
          "أيلول",
          "تشرين الأول",
          "تشرين الثاني",
          "كانون الأول",
        ];

  const getDaysInMonth = (year, month) =>
    dayjs(`${year}-${month + 1}-01`).daysInMonth();

  const [days, setDays] = useState(
    Array.from(
      { length: getDaysInMonth(selectedYear, selectedMonth) },
      (_, i) => i + 1
    )
  );

  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedYear, selectedMonth]);

  const years = Array.from({ length: 126 }, (_, i) => 1900 + i);

  useEffect(() => {
    const newDate = dayjs()
      .year(selectedYear)
      .month(selectedMonth)
      .date(selectedDay);
    if (!newDate.isSame(selectedDate, "day")) {
      onDateChange(newDate);
    }
  }, [selectedYear, selectedMonth, selectedDay, onDateChange, selectedDate]);

  const updateValue = (type, direction) => {
    if (type === "year") {
      setSelectedYear((prev) => ((prev + direction - 1900 + 126) % 126) + 1900);
    } else if (type === "month") {
      setSelectedMonth((prev) => (prev + direction + 12) % 12);
    } else if (type === "day") {
      setSelectedDay((prev) => {
        const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
        return ((prev + direction - 1 + daysInMonth) % daysInMonth) + 1;
      });
    }
  };

  const handleDragStart = (e, type) => {
    e.preventDefault();
    dragState.current = {
      type,
      startY: e.clientY || e.touches[0].clientY,
    };

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDragMove);
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!dragState.current.type) return;

    const currentY = e.clientY || e.touches[0].clientY;
    const delta = currentY - dragState.current.startY;

    if (Math.abs(delta) > 30) {
      const direction = delta > 0 ? -1 : 1;
      updateValue(dragState.current.type, direction);

      // Reset the drag state to allow continuous scrolling
      dragState.current.startY = currentY;
    }
  };

  const handleDragEnd = () => {
    dragState.current = { type: null, startY: 0 };

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchmove", handleDragMove);
    document.removeEventListener("touchend", handleDragEnd);
  };

  const handleInfiniteScroll = (event, type) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 1 : -1;

    if (type === "year") {
      setSelectedYear((prev) => {
        let newYear = prev + direction;
        // Wrap around if newYear goes below 1900 or above 2025
        if (newYear < 1900) newYear = 2025;
        if (newYear > 2025) newYear = 1900;
        return newYear;
      });
    } else if (type === "month") {
      setSelectedMonth((prev) => {
        let newMonth = prev + direction;
        // Wrap around if newMonth goes below 0 or above 11
        if (newMonth < 0) newMonth = 11;
        if (newMonth > 11) newMonth = 0;
        return newMonth;
      });
    } else if (type === "day") {
      setSelectedDay((prev) => {
        let newDay = prev + direction;
        const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
        // Wrap around if newDay goes below 1 or above the number of days in the month
        if (newDay < 1) newDay = daysInMonth;
        if (newDay > daysInMonth) newDay = 1;
        return newDay;
      });
    }
  };

  const renderCenteredItems = (list, selectedIndex, type) => {
    const maxVisible = 7;
    const half = Math.floor(maxVisible / 2);

    return Array.from({ length: maxVisible }).map((_, index) => {
      const infiniteIndex =
        (selectedIndex + index - half + list.length) % list.length;
      const item = list[infiniteIndex];
      const isSelected = index === half;

      return (
        <div
          key={`${type}-${index}-${item}`}
          className={`py-2 ${
            isSelected ? "font-bold" : ""
          } text-center transition-all duration-300`}
          onMouseDown={(e) => handleDragStart(e, type)}
          onTouchStart={(e) => handleDragStart(e, type)}
        >
          {item}
        </div>
      );
    });
  };

  return (
    <div
      className={`py-4 bg-white shadow-lg rounded-xl ${className}`}
      {...props}
    >
      <div className="flex flex-col items-center justify-center relative">
        <div className="absolute top-[35.9%] left-0 right-0 h-11 bg-yellow-300 z-[2] opacity-30" />
        <div className="flex items-center justify-center space-y-4 relative">
          <div className="flex justify-center space-x-1">
            <div
              ref={yearRef}
              onWheel={(e) => handleInfiniteScroll(e, "year")}
              className="w-24 text-center cursor-pointer select-none z-[3]"
            >
              {renderCenteredItems(years, years.indexOf(selectedYear), "year")}
            </div>
            <div
              ref={monthRef}
              onWheel={(e) => handleInfiniteScroll(e, "month")}
              className="w-24 text-center cursor-pointer select-none z-[3]"
            >
              {renderCenteredItems(months, selectedMonth, "month")}
            </div>
            <div
              ref={dayRef}
              onWheel={(e) => handleInfiniteScroll(e, "day")}
              className="w-24 text-center cursor-pointer select-none z-[3]"
            >
              {renderCenteredItems(days, selectedDay - 1, "day")}
            </div>
          </div>
        </div>
        <div className="w-full mt-4 flex justify-center">
          <button
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none"
            onClick={() =>
              alert(
                `Selected Date: ${String(selectedDay).padStart(2, "0")} ${
                  months[selectedMonth]
                } ${selectedYear}`
              )
            }
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
