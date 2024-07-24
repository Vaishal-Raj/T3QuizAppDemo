import { generateLeaderBoard } from '~/server/actions';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Award, User } from 'lucide-react'; // Import Lucide icons

const Leaderboard = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  const leaderboard = await generateLeaderBoard(id);

  return (
    <div className="p-6 bg-gray-100 dark:bg-slate-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <Award className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
        <span>Leaderboard for Quiz ID: {id}</span>
      </h1>
      {leaderboard?.length > 0 ? (
        <div className="space-y-6">
          {leaderboard.map((item) => (
            <div
              key={item.id ?? Math.random()}
              className="flex items-center space-x-4 p-4 border rounded-lg bg-white dark:bg-gray-700 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <Avatar>
                <AvatarImage
                  src={item.image ? item.image : "https://ohsobserver.com/wp-content/uploads/2022/12/Guest-user.png"}
                  alt={item.name ?? 'Avatar'}
                />
                <AvatarFallback>{item.name ? item.name.charAt(0).toUpperCase() : 'N/A'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  <span>{item.name ?? 'N/A'}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Quiz ID: {item.quizId ?? 'N/A'}
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {item.score ?? 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {item.time ? new Date(item.time).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-900 dark:text-gray-100 text-center mt-10">
          <User className="w-10 h-10 mx-auto text-gray-500 dark:text-gray-400 mb-2" />
          No participants found for this quiz.
        </p>
      )}
    </div>
  );
};

export default Leaderboard;
