"use client"

import Image from "next/image";
import { toast,Toaster } from 'react-hot-toast';
import { useState } from 'react';
export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username:username, password: password }),
    });

    const data = await res.json();
    console.log(data)
    alert(data || data.error);
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    toast.loading('Waiting...');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username:username, password: password }),
    });

    

    const data = await res.json();
    toast.dismiss()
    if (data.message=='Login successful'){
      toast.success('Login successful');
      window.location.href = '/app/home'
    }
    else{
      toast.error(data.message);
  };}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-red-500">
      
      <main className="flex flex-col gap-8 items-center">
        <Image
          src="/logo.png"
          alt="Next.js logo"
          width={1000}
          height={250}
          style={{ width: '50%', height: 'auto' }}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center font-[family-name:var(--font-geist-mono)]">
          {/* ...existing code... */}
        </ol>

        <div className="">
          <form  className="flex flex-col gap-4 items-center " >
          <input type="text" style={{color:'black'}} className="rounded border border-solid border-gray-300 p-2 mb-4" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            
          <input type="password" style={{color:'black'}}  className="rounded border border-solid border-gray-300 p-2 mb-4" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <div className="flex gap-4">
              <button
                onClick={ handleLogin}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                <Image
                  className="dark:invert"
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
                 
                />
                Login
              </button>
              <button
                
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                onClick={handleSignup}
              >
               Sign UP
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
