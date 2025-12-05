"use client"

import { QCMForm } from "@/components/profiling/QCMForm"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const handleProfileSubmit = async (data: any) => {
    console.log("Profile submitted:", data)
    // TODO: Store profile in context or local storage
    localStorage.setItem("userProfile", JSON.stringify(data))
    router.push("/results")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Decathlon AI Sportive Platform
        </p>
      </div>

      <div className="relative flex place-items-center">
        <QCMForm onSubmit={handleProfileSubmit} />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
      </div>
    </main>
  )
}
