import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { User } from 'next-auth'
import Link from 'next/link'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react';


type Props = {
    user: User
}

const UserAccountNav = ({user}: Props) => {
    // console.log(user.image)
  return (
        <DropdownMenu >
            <DropdownMenuTrigger>
            <Avatar>
                <AvatarImage src={user.image} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900">
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-white text-2xs font-semibold">
                    {user.name}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white text-2xs font-semibold">
                    {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white text-2xs font-semibold">
                    <Link href="/api/auth/signout">SIGN-OUT <LogOut className='w-4 h-4 inline'/></Link>
                </DropdownMenuItem> 
            </DropdownMenuContent>
        </DropdownMenu>
  )
}

export default UserAccountNav