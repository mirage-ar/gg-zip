import React from "react";
import Image from "next/image";

import styles from "./Calendar.module.css";

interface CalendarViewProps {
  setShowCalendar: (showCalendar: boolean) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ setShowCalendar }) => {
  // Function to stop event propagation
  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation(); // This stops the click from propagating to the parent
  };

  return (
    <div className={styles.main} onClick={() => setShowCalendar(false)}>
      <div className={styles.container} onClick={handleContainerClick}>
        <div className={styles.header}>
          <p>
            GG Schedule <Image src={`/assets/icons/icons-24/calendar.svg`} alt="calendar icon" width={24} height={24} />
          </p>
          <p>
            <span className={styles.grey}>(</span>August<span className={styles.grey}>)</span>
          </p>
        </div>
        <div className={styles.body}>
          <Image src={`/assets/images/schedule.png`} alt="shedule" width={559} height={330} />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
