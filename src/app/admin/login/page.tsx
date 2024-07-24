import { redirect } from 'next/navigation';
import React from 'react';
import QuizForm from '~/components/QuizComponents/QuizForm';
import { auth } from '~/auth';

type Props = {};

const AdminLogin = async (props: Props) => {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin');
  } else {
    if (session.user.role !== 'admin') {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Access Denied
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Only admins can view this page.
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Welcome, {session.user.name}! Use the form below to create and manage quizzes.
        </p>
        <QuizForm />
      </div>
    </div>
  );
};

export default AdminLogin;
