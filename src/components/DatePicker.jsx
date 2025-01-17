import React, { useState } from "react";

const DatePicker = ({
  fadingNumber = "none",
  circularNumber = "none",
  ...props
}) => {
  const [selectedYear, setSelectedYear] = useState(1990); // Default selected year
  const [selectedMonth, setSelectedMonth] = useState(1); // Default selected month
  const [selectedDay, setSelectedDay] = useState(1); // Default selected day

  const months = [
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
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1 to 31

  // Years range from 1900 to 2025
  const years = Array.from({ length: 126 }, (_, i) => 1900 + i); // 1900 to 2025

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
      setSelectedMonth(
        (prev) => (prev + direction + months.length) % months.length
      );
    } else if (type === "day") {
      setSelectedDay(
        (prev) => ((prev - 1 + direction + days.length) % days.length) + 1
      );
    }
  };

  const handleInfiniteDrag = (event, type) => {
    let startY = event.clientY;
    const moveHandler = (moveEvent) => {
      const sensitivity = 60; // Increase this value to make dragging slower
      const diff = Math.floor((startY - moveEvent.clientY) / sensitivity); // Slower dragging
      if (type === "year") {
        setSelectedYear((prev) => {
          let newYear = prev + diff;
          // Wrap around if newYear goes below 1900 or above 2025
          if (newYear < 1900) newYear = 2025;
          if (newYear > 2025) newYear = 1900;
          return newYear;
        });
      } else if (type === "month") {
        setSelectedMonth(
          (prev) => (prev + diff + months.length) % months.length
        );
      } else if (type === "day") {
        setSelectedDay(
          (prev) => ((prev - 1 + diff + days.length) % days.length) + 1
        );
      }
    };
    const stopHandler = () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", stopHandler);
    };
    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", stopHandler);
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
          return false;
        } else {
          return true;
        }
      };

      return (
        <div
          key={`${type}-${index}-${item}`}
          style={{
            opacity: `${opacity}%`,
            fontSize: fontSize,
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
          <div className="absolute top-[33.5%] left-0 right-0 h-11 bg-yellow-300 z-[2] opacity-30 " />
          <div className="flex items-center justify-center space-y-4 relative">
            <div className="flex justify-center space-x-1">
              <div
                className="w-24 text-center cursor-pointer select-none z-[3]"
                onWheel={(e) => handleInfiniteScroll(e, "year")}
                onMouseDown={(e) => handleInfiniteDrag(e, "year")}
              >
                {renderCenteredItems(
                  years,
                  years.indexOf(selectedYear),
                  "year"
                )}
              </div>
              <div
                className="w-24 text-center cursor-pointer select-none z-[3]"
                onWheel={(e) => handleInfiniteScroll(e, "month")}
                onMouseDown={(e) => handleInfiniteDrag(e, "month")}
              >
                {renderCenteredItems(months, selectedMonth, "month")}
              </div>
              <div
                className="w-24 text-center cursor-pointer select-none z-[3]"
                onWheel={(e) => handleInfiniteScroll(e, "day")}
                onMouseDown={(e) => handleInfiniteDrag(e, "day")}
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
    </>
  );
};

export default DatePicker;
