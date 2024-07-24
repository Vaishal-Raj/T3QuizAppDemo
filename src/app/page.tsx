"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Star } from 'lucide-react'; // Import the icons

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 animate__animated animate__fadeIn">
          Welcome to Quiz App
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 animate__animated animate__fadeIn animate__delay-1s">
          Challenge yourself with our exciting quizzes or create your own!
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <Link
            href="/admin/login"
            className="p-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105 animate__animated animate__zoomIn animate__delay-2s flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-6 h-6" />
            <span>Create a Quiz</span>
          </Link>
          <Link
            href="/users/login"
            className="p-4 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300 transform hover:scale-105 animate__animated animate__zoomIn animate__delay-2s flex items-center justify-center space-x-2"
          >
            <Star className="w-6 h-6" />
            <span>Challenge Yourself</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
