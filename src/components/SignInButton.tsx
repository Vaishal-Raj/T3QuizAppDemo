"use client"
import React from 'react'
import { Button } from './ui/button'
import { signIn } from 'next-auth/react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../components/ui/dropdown-menu"
  
type Props = {
    text:string
}

const SignInButton = ({text}: Props) => {
  return (
    <>
    <DropdownMenu >
        <DropdownMenuTrigger className="text-2xl font-bold">SIGN-IN</DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-900">
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Button className="text-2xs font-semibold" onClick={() => signIn("google").catch(err => console.log(err))}>
                    {text} with Google
                </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Button className="text-2xs font-semibold" onClick={() => signIn("discord").catch(err => console.log(err))}>
                    {text} with Discord
                </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Button className="text-2xs font-semibold"  onClick={() => signIn("github").catch(err => console.log(err))}>
                    {text} with GitHub
                </Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</>

  )
}

export default SignInButton