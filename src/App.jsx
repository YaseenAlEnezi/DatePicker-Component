import React, { useState } from "react";
import DatePicker from "./components/DatePicker";
import dayjs from "dayjs";
import { Modal } from "./components/Modal";

const App = () => {
  const [lang, setLang] = useState("ar");
  const [date, setDate] = useState(dayjs());
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DatePicker
          fadingNumber="all"
          circularNumber={false}
          lang={lang}
          selectedDate={date}
          onDateChange={handleDateChange}
        />
      </Modal>
    </>
  );
};

export default App;
