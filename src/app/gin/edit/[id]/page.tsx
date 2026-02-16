'use client'
import { use } from 'react'
import GinForm from '@/components/gin/GinForm'

export default function EditGinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <GinForm mode="edit" id={parseInt(id)} />
}
