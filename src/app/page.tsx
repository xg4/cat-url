'use client'

import Form from '@/components/Form'
import dynamic from 'next/dynamic'

const List = dynamic(() => import('@/components/List'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="container mx-auto space-y-10 pt-10">
      <h1 className="text-center text-3xl font-bold text-sky-300">Cat URL</h1>
      <Form />
      <List />
    </main>
  )
}
