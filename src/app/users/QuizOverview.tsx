"use server";
import React from 'react';
import Link from 'next/link';
import { db } from '~/server/db';
import { quizzes } from '~/server/db/schema';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { ArrowRight } from 'lucide-react';

interface User {
  id: string | undefined | null;
  name: string | undefined | null;
  email: string | undefined | null;
}

const fetch_quizes = async () => {
  const data = await db.select().from(quizzes);
  return data;
}

const QuizOverview = async ({ userInfo }: { userInfo: User }) => {
  const quiz_data = await fetch_quizes();
  console.log(quiz_data);

  return (
    <div className="p-6 flex flex-col items-center bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 animate__animated animate__fadeIn">
        Welcome, {userInfo.name}
      </h1>
      <h2 className="text-lg mb-6 text-gray-700 dark:text-gray-300 animate__animated animate__fadeIn animate__delay-1s">
        Your ID: {userInfo.id}
      </h2>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100 animate__animated animate__fadeIn animate__delay-2s">
        Live Quizzes
      </h1>
      <div className="flex flex-col space-y-4 w-full max-w-2xl">
        {quiz_data.map((quiz) => (
          <Card 
            key={quiz.id}
            className="shadow-lg rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:translate-y-1 bg-white dark:bg-gray-800"
          >
            <CardHeader className="p-4 bg-blue-600 dark:bg-slate-700 text-white rounded-t-lg flex items-center justify-between">
              <h2 className="text-center text-xl font-semibold">{quiz.title}</h2>
              <ArrowRight className="w-6 h-6 text-white"/>
            </CardHeader>
            <CardContent className="p-4 bg-gray-100 dark:bg-gray-600">
              <p className="text-gray-800 dark:text-gray-200">Join this quiz and test your knowledge!</p>
            </CardContent>
            <CardFooter className="p-4 bg-white dark:bg-slate-400 rounded-b-lg flex justify-end">
              <Link
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-slate-600 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                href={`/quiz/${quiz.id}`}
              >
                Start Quiz
                <ArrowRight className="w-4 h-4 ml-2"/>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizOverview;
