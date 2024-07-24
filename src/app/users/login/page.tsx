import React from 'react'
import QuizOverview from '../QuizOverview'
import { auth } from '~/auth';
import { redirect } from 'next/navigation';


const UserLogin = async () => {
  const session=await auth();
  if(!session?.user){
    redirect('/api/auth/signin');
  }
  const userInfo = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
  return (
    <div>
      <QuizOverview userInfo={userInfo}/>
    </div>
  )
}

export default UserLogin