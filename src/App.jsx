import React, { useState } from "react";
import DatePicker from "./components/DatePicker";
import dayjs from "dayjs";

const App = () => {
  const [lang, setLang] = useState("ar");
  const [date, setDate] = useState(dayjs());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <>
      <div className="flex h-[100dvh]">
        <DatePicker
          fadingNumber="all"
          circularNumber={false}
          lang={lang}
          selectedDate={date}
          onDateChange={handleDateChange}
        />
      </div>
    </>
  );
};

export default App;
