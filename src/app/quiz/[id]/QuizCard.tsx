"use client";
import Link from "next/link";
import { toast } from "sonner"

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Button } from "~/components/ui/button";
import { insertUserLeaderboard } from "~/server/actions";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  options: Option[];
}

interface Quiz {
  userInfo: User;
  id: number;
  title: string;
  questions: Question[];
}

interface User {
  id: string | undefined | null;
  name: string | undefined | null;
  email: string | undefined | null;
  image: string | undefined | null;
}

const socket = io("http://localhost:3001");

const QuizCard = ({ quizData }: { quizData: Quiz }) => {
  const [currQid, setCurrQid] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [answer, setAnswer] = useState<string | null>(null);
  const [granted, setGranted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(undefined);
  const id: number = quizData.id;
  const [room, setRoom] = useState<number>(id);

  useEffect(() => {
    socket.on("start_quiz", (data) => {
      const { message, currQuestion } = data;
      console.log("Current question from server : ", currQuestion);
      setCurrentQuestion(currQuestion);
      setTimeLeft(10);
    });

    socket.on("granted_start", (data) => {
      console.log("inside granted socket");
      setGranted(true);
    });

    socket.on("next_question", (data) => {
      const { question, isCorrect } = data;
      console.log(`Received from server: ${question}`);
      if (isCorrect !== undefined) {
        if (isCorrect) {
          setScore((prev) => prev + 1);
        }
      }
      setCurrQid((prev) => prev + 1);
      setTimeLeft(10);
      setAnswer(null); // Clear the selected answer
      setCurrentQuestion(question);
    });

    socket.on("quiz_finished", (data: { isCorrect: boolean }) => {
      if (data.isCorrect) {
        setScore((prev) => prev + 1);
      }
      console.log("FINISHED QUIZ THROUGH SOCKET");
      console.log("Score");
      setCurrQid(quizData.questions.length);
    });

    return () => {
      socket.off("start_quiz");
      socket.off("granted_start");
      socket.off("next_question");
      socket.off("quiz_finished");
    };
  }, [socket]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      } else {
        handleNextQuestion();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (currQid >= quizData.questions.length) {
      EndOfQuiz();
    }
  }, [currQid]); 

  const handleNextQuestion = () => {
    socket.emit("send_answer", { roomId: id, answer });
  };

  const joinRoom = () => {
    if (room !== null) {
      socket.emit("join_room", room);
      socket.emit("sendQuiz", { roomId: room, quizData: quizData });
    }
  };

  const EndOfQuiz = async () => {
    console.log(`Score at end of quiz = ${score}`);
    await insertUserLeaderboard({
      userInfo: quizData.userInfo,
      score: score,
      quizId: quizData.id
    });
    toast("Quiz submitted successfully!");
  };

  return (
    <>
      {granted ? (
        <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Quiz: {quizData.title}
          </h1>
          {currQid < quizData.questions.length ? (
            <div className="question-container">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Question {currQid + 1}/{quizData.questions.length}
              </h2>
              <p className="mb-4 text-xl text-gray-900 dark:text-gray-100">{currentQuestion?.text}</p>
              <ul className="space-y-2 mb-4">
                {currentQuestion?.options.map((option, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="option"
                      id={`option-${index}`}
                      value={option.text}
                      checked={answer === option.text} // Controlled input
                      onChange={(e) => setAnswer(e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`option-${index}`}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {option.text}
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Next
                </button>
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {timeLeft} seconds left
                </span>
              </div>
            </div>
          ) : (
           
            <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
                  Quiz Finished!
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                  Your score is <span className="font-bold text-blue-500">{score}</span> out of <span className="font-bold text-blue-500">{quizData.questions.length}</span>
                </p>
                <Link href={`/users/Leaderboard/${quizData.id}`} className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 px-6 py-3 rounded-md shadow-md">
                  View Leaderboard
                </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center min-h-screen">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-b-8 border-blue-500 mb-4"></div>
            <span className="absolute inset-0 flex items-center justify-center text-blue-500 font-semibold">Loading...</span>
          </div>
          <Button onClick={joinRoom} className="mb-2">
            Join Room
          </Button>
      </div>
      )}
    </>
  );
};

export default QuizCard;
