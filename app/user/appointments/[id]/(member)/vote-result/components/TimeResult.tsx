"use client";
import { useState } from "react";
import styles from "./TimeResult.module.scss";

interface TimeResult {
  start_time: string;
  end_time: string;
  member: string[];
  result: {
    date: string;
    user: string[];
  }[];
}

const TimeResult = ({ timeProps }: { timeProps: TimeResult }) => {
  const timeResult: TimeResult = timeProps;

  const getDateList = (start: Date, end: Date) => {
    const dates = [];
    const current = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      dates.push(`${year}-${month}-${day}`);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const getTimeList = (start: number, end: number) => {
    if (start < 0 || end > 23 || start > end) {
      throw new Error("Invalid time range. Ensure 0 <= start <= end <= 23.");
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const startDate = new Date(timeResult.start_time);
  const endDate = new Date(timeResult.end_time);

  const dateList = getDateList(startDate, endDate);
  const timeList = getTimeList(startDate.getHours(), endDate.getHours());

  // 상태 관리
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // 셀 클릭 핸들러
  const handleCellClick = (date: string, hour: number) => {
    const fullDate = `${date} ${String(hour).padStart(2, "0")}:00:00`;
    setSelectedTime(fullDate); // 선택한 시간 저장
  };

  // 투표 결과에 따른 셀 스타일 결정
  const getCellClass = (date: string, hour: number) => {
    const fullDate = `${date}T${String(hour).padStart(2, "0")}:00:00`; // ✅ `T` 추가하여 API 형식과 일치
    const result = timeResult.result.find((item) => item.date === fullDate);

    if (!result || !result.user || result.user.length === 0) {
      return styles.noVote; // ✅ 투표자가 없으면 '불가능'
    }

    const percentage = result.user.length / timeResult.member.length;
    if (percentage > 0.66) return styles.highVote;
    if (percentage > 0.33) return styles.mediumVote;
    return styles.lowVote;
  };

  // 선택된 시간에 해당하는 사용자 목록 가져오기
  const selectedResult =
    selectedTime &&
    timeResult.result.find(
      (item) => item.date === selectedTime.replace(" ", "T")
    ); // ✅ `T` 추가

  const possibleUsers = selectedResult ? selectedResult.user : [];
  const impossibleUsers = timeResult.member.filter(
    (member) => !possibleUsers.includes(member)
  );

  return (
    <div className={styles.schedule}>
      <div className={styles.row}>
        <div className={styles.timeLabel}></div>
        {dateList.map((date, index) => (
          <div key={index} className={styles.weekDay}>
            {new Date(date).toLocaleDateString("ko-KR", { weekday: "short" })}
          </div>
        ))}
      </div>
      <div className={styles.row}>
        <div className={styles.timeLabel}>시간</div>
        {dateList.map((date, index) => (
          <div key={index} className={styles.day}>
            {new Date(date).getDate()}
          </div>
        ))}
      </div>
      <div className={styles.timeGrid}>
        <div className={styles.timeLabels}>
          {timeList.map((hour) => (
            <div key={hour} className={styles.time}>
              {hour}
            </div>
          ))}
        </div>
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${dateList.length}, 1fr)` }}
        >
          {timeList.map((hour) =>
            dateList.map((date) => {
              const fullDate = `${date} ${String(hour).padStart(2, "0")}:00:00`;
              return (
                <div
                  key={`${date}-${hour}`}
                  className={`${styles.cell} ${getCellClass(date, hour)} ${
                    selectedTime === fullDate ? styles.selected : ""
                  }`}
                  onClick={() => handleCellClick(date, hour)} // 셀 클릭 이벤트
                ></div>
              );
            })
          )}
        </div>
      </div>

      {/* 투표 가능 / 불가능 사용자 표시 */}
      {selectedTime && (
        <div className={styles.votePerson}>
          <div>
            <span className={styles.possible}>가능</span>
            <ul>
              {possibleUsers.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className={styles.impossible}>불가능</span>
            <ul>
              {impossibleUsers.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeResult;
