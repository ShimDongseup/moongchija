import { useEffect, useState } from "react";
import { useCreateAppointment } from "@/context/CreateAppointmentContext";

const quizList = [
  "내 MBTI는?",
  "내가 평소에 싫다고 하는 사람은?",
  "내가 어제 저녁에 먹은 음식은?",
  "내가 직전에 쓰던 핸드폰은?",
  "너의 이름은?",
  "내가 사형수라면 마지막 식사는 뭘까?",
  "햄최몇?",
  "내가 갑자기 슈퍼 히어로가 된다면 내 초능력은 뭐일까?",
  "너의 신발 사이즈는?",
  "내가 좋아하는 동물은?",
  "직접 입력하기",
];

const useCreateInformation = (onPageChange: (index: number) => void) => {
  const { appointment, setAppointment } = useCreateAppointment();

  const [isCustomQuiz, setIsCustomQuiz] = useState<boolean>(false); 
  const [nameError, setNameError] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  // 퀴즈 선택 변경
  const handleQuizChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setIsCustomQuiz(selectedValue === "직접 입력하기");

    setAppointment((prev) => ({
      ...prev,
      quiz: selectedValue === "직접 입력하기" ? "" : selectedValue,
    }));
  };

  // 약속 이름 입력
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameError(
      value.length > 20 ? "약속 이름은 최대 20자까지 입력 가능합니다." : ""
    );
    setAppointment((prev) => ({ ...prev, title: value }));
  };

  // 퀴즈 내용을 직접 입력
  const handleSetQuiz = (quiz: string) => {
    setAppointment((prev) => ({ ...prev, quiz })); 
  };

  // 답변 내용을 설정
  const handleSetAnswer = (answer: string) => {
    const newAnswer = answer.trim().toLowerCase();
    setAppointment((prev) => ({ ...prev, answer: newAnswer }));
  };

  // '다음' 버튼 클릭
  const handleNextButton = () => {
    onPageChange(2);
  };

  // '다음' 버튼 활성화 여부
  useEffect(() => {
    setIsButtonActive(
      appointment.title.trim().length > 0 &&
        nameError === "" &&
        appointment.quiz!.trim().length > 0 &&
        appointment.answer!.trim().length > 0
    );
  }, [appointment.title, appointment.quiz, appointment.answer, nameError]);

  return {
    quizList,
    hooks: {
      appointment,
      isCustomQuiz,
      nameError,
      isButtonActive,
    },
    handlers: {
      handleQuizChange,
      handleNameChange,
      handleSetQuiz,
      handleSetAnswer,
      handleNextButton,
    },
  };
};

export default useCreateInformation;
