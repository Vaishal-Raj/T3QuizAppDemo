import { auth } from '~/auth';
import Link from 'next/link';
import React from 'react'
import SignInButton from './SignInButton';
import { Button } from './ui/button';
import UserAccountNav from './UserAccountNav';
import { ThemeOption } from './ThemeOptions';

type Props = {}

const NavBar = async (props: Props) => {
    const session= await auth();
    if(session?.user){
       console.log(JSON.stringify(session))
    }
    return (
        <div className='border-y-2 border-white'>
            <div className="container mx-auto flex items-center justify-between px-4">
                <Link className="text-2xl font-bold" 
                href="/">
                    QUIZ APP
                </Link>
                <div className="flex item-center">
                    <ThemeOption className='m-4'/>
                    <div className="flex items-center space-x-4 relative left-1/4">
                        {session?.user ? (
                                <UserAccountNav user={session.user}/>
                        ) : (
                            <SignInButton text="SIGN-IN" />
                        )}
                    </div>
                    
                </div>
                
            </div>
        </div>
    );
}

export default NavBar