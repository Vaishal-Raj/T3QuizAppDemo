"use server";
import { redirect } from 'next/navigation';
import React from 'react';
import { db } from '~/server/db';
import { quizzes, questions as Qschema, options, users } from '~/server/db/schema';
import { eq, sql, inArray } from 'drizzle-orm';
import QuizCard from './QuizCard';
import { auth } from '~/auth';

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

const fetchQuizWithDetails = async (id: number, userInfo: User): Promise<Quiz | null> => {
  const quizResult = await db.select().from(quizzes).where(eq(quizzes.id, id));
  if (!quizResult.length) return null;

  const questionsResult = await db
    .select()
    .from(Qschema)
    .where(eq(Qschema.quizId, id));

  if (!questionsResult.length) return null;

  const questionIds = questionsResult.map((question) => question.id);

  const optionsResult = await db
    .select()
    .from(options)
    .where(inArray(options.questionId, questionIds));

  const structuredQuiz: Quiz = {
    userInfo: userInfo,
    id: id,
    title: quizResult[0]?.title || "Untitled Quiz",
    questions: questionsResult.map((question) => ({
      text: question.text,
      options: optionsResult
        .filter(option => option.questionId === question.id)
        .map(option => ({
          text: option.text,
          isCorrect: option.isCorrect
        }))
    }))
  };

  return structuredQuiz;
};

const QuizPage = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  const session = await auth();
  if (!session?.user) {
    alert("Please login to continue!");
    redirect("/");
  }
  
  const userInfo = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };

  const quizData = await fetchQuizWithDetails(id, userInfo);

  if (!quizData) {
    return <div className="text-center text-red-500">Quiz not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg">
        <h1 className="text-2xl underline font-bold text-center text-gray-900 dark:text-gray-100 mb-4 animate__animated animate__fadeIn">
          {quizData.title}
        </h1>
        <QuizCard quizData={quizData} />
      </div>
    </div>
  );
};

export default QuizPage;
