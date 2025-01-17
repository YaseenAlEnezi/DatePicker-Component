import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

const DatePicker = ({
  fadingNumber = "none",
  circularNumber = false,
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

  let months;
  if (lang === "en") {
    months = [
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
    ];
  } else if (lang === "ar") {
    months = [
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
  }

  // Get the number of days in the selected month and year
  const getDaysInMonth = (year, month) => {
    return dayjs(`${year}-${month + 1}-01`).daysInMonth();
  };

  const [days, setDays] = useState(
    Array.from(
      { length: getDaysInMonth(selectedYear, selectedMonth) },
      (_, i) => i + 1
    )
  );

  // Update the days array when the month or year changes
  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    // Ensure the selected day is within the new number of days
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedYear, selectedMonth]);

  // Years range from 1900 to 2025
  const years = Array.from({ length: 126 }, (_, i) => 1900 + i); // 1900 to 2025

  // Update the selected date when year, month, or day changes
  useEffect(() => {
    const newDate = dayjs()
      .year(selectedYear)
      .month(selectedMonth)
      .date(selectedDay);
    onDateChange(newDate); // Notify the parent component of the new date
  }, [selectedYear, selectedMonth, selectedDay, onDateChange]);

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

  const handleInfiniteDrag = (event, type) => {
    let startY = event.clientY || event.touches[0].clientY;
    const moveHandler = (moveEvent) => {
      const sensitivity = 1500; // Increase this value to make dragging slower
      const currentY = moveEvent.clientY || moveEvent.touches[0].clientY;
      const diff = Math.floor((startY - currentY) / sensitivity); // Slower dragging

      if (type === "year") {
        setSelectedYear((prev) => {
          let newYear = prev + diff;
          // Wrap around if newYear goes below 1900 or above 2025
          if (newYear < 1900) newYear = 2025;
          if (newYear > 2025) newYear = 1900;
          return newYear;
        });
      } else if (type === "month") {
        setSelectedMonth((prev) => {
          let newMonth = prev + diff;
          // Wrap around if newMonth goes below 0 or above 11
          if (newMonth < 0) newMonth = 11;
          if (newMonth > 11) newMonth = 0;
          return newMonth;
        });
      } else if (type === "day") {
        setSelectedDay((prev) => {
          let newDay = prev + diff;
          const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
          // Wrap around if newDay goes below 1 or above the number of days in the month
          if (newDay < 1) newDay = daysInMonth;
          if (newDay > daysInMonth) newDay = 1;
          return newDay;
        });
      }
    };
    const stopHandler = () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("mouseup", stopHandler);
      window.removeEventListener("touchend", stopHandler);
    };
    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("touchmove", moveHandler);
    window.addEventListener("mouseup", stopHandler);
    window.addEventListener("touchend", stopHandler);
  };

  const renderCenteredItems = (list, selectedIndex, type) => {
    const maxVisible = 7; // Number of visible items
    const half = Math.floor(maxVisible / 2);

    return Array.from({ length: maxVisible }).map((_, index) => {
      const infiniteIndex =
        (selectedIndex + index - half + list.length) % list.length;
      const item = list[infiniteIndex];
      const isSelected = index === half;

      // Calculate opacity and font size based on the index
      let opacity;
      let fontSize;
      if (index === 0 || index === 6) {
        opacity = 40;
        fontSize = "0.5rem"; // Smallest font size
      } else if (index === 1 || index === 5) {
        opacity = 60;
        fontSize = "0.7rem"; // Medium font size
      } else if (index === 2 || index === 4) {
        opacity = 80;
        fontSize = "0.9rem"; // Larger font size
      } else if (index === 3) {
        opacity = 100;
        fontSize = "1.1rem"; // Largest font size (centered item)
      }

      const isFading = () => {
        if (fadingNumber === "none") {
          return 100;
        } else if (fadingNumber === "all") {
          return `${opacity}%`;
        } else {
          return 100;
        }
      };

      const isCircular = () => {
        if (circularNumber === false) {
          return `1rem`;
        } else if (circularNumber === true) {
          return `${fontSize}`;
        } else {
          return `1rem`;
        }
      };

      return (
        <div
          key={`${type}-${index}-${item}`}
          style={{
            opacity: isFading(),
            fontSize: isCircular(),
          }} // Use inline styles for dynamic opacity and font size
          className={`py-2 ${
            isSelected ? "font-bold" : ""
          } text-center transition-all duration-300`}
        >
          {item}
        </div>
      );
    });
  };

  return (
    <>
      <div className="py-4 bg-white shadow-lg rounded-xl ">
        <div className="flex flex-col items-center justify-center relative">
          <div className="absolute top-[35.9%] left-0 right-0 h-11 bg-yellow-300 z-[2] opacity-30 " />
          <div className="flex items-center justify-center space-y-4 relative">
            <div className="flex justify-center space-x-1">
              <div
                ref={yearRef}
                className="w-24 text-center cursor-pointer select-none z-[3]"
                onWheel={(e) => handleInfiniteScroll(e, "year")}
                onMouseDown={(e) => handleInfiniteDrag(e, "year")}
                onTouchStart={(e) => handleInfiniteDrag(e, "year")}
              >
                {renderCenteredItems(
                  years,
                  years.indexOf(selectedYear),
                  "year"
                )}
              </div>
              {/* <div
                ref={monthRef}
                className="w-24 text-center cursor-pointer select-none z-[3]"
                onWheel={(e) => handleInfiniteScroll(e, "month")}
                onMouseDown={(e) => handleInfiniteDrag(e, "month")}
                onTouchStart={(e) => handleInfiniteDrag(e, "month")}
              >
                {renderCenteredItems(months, selectedMonth, "month")}
              </div>
              <div
                ref={dayRef}
                className="w-24 text-center cursor-pointer select-none z-[3]"
                onWheel={(e) => handleInfiniteScroll(e, "day")}
                onMouseDown={(e) => handleInfiniteDrag(e, "day")}
                onTouchStart={(e) => handleInfiniteDrag(e, "day")}
              >
                {renderCenteredItems(days, selectedDay - 1, "day")}
              </div> */}
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
    </>
  );
};

export default DatePicker;
