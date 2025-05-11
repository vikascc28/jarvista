'use client'
import { BlurFade } from '@/components/magicui/blur-fade'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthContext } from '@/context/AuthContext'
import { api } from '@/convex/_generated/api'
import AiAssistantsList from '@/services/AiAssistantsList'
import { useConvex, useMutation } from 'convex/react'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

export type ASSISTANT = {
  id: number,
  name: string,
  title: string,
  image: string,
  instruction: string,
  userInstruction: string,
  sampleQuestions: string[],
  aiModelId?: string
}

function AIAssistants() {
  const [selectedAssistant, setSelectedAssistant] = useState<ASSISTANT[]>([]);
  const insertAssistant = useMutation(api.userAiAssistants.InsertSelectedAssistants)
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const convex = useConvex()
  const router = useRouter();

  useEffect(() => {
    user && GetUserAssistants()
  }, [user])

  const GetUserAssistants = async () => {
    const result = await convex.query(api.userAiAssistants.GetAllUserAssistants, {
      uid: user?._id
    })
    if (result.length > 0) {
      router.replace('/workspace')
      return;
    }
  }

  const onSelect = (assistant: ASSISTANT) => {
    const isSelected = selectedAssistant.find((item: ASSISTANT) => item.id === assistant.id)
    if (isSelected) {
      setSelectedAssistant(selectedAssistant.filter((item: ASSISTANT) => item.id !== assistant.id))
    } else {
      setSelectedAssistant(prev => [...prev, assistant])
    }
  }

  const IsAssistantSelected = (assistant: ASSISTANT) => {
    return selectedAssistant.some((item: ASSISTANT) => item.id === assistant.id)
  }

  const onClickContinue = async () => {
    setLoading(true);
    await insertAssistant({
      records: selectedAssistant,
      uid: user?._id
    })
    setLoading(false)
    router.push('/workspace')
  }

  return (
    <div className='px-10 mt-20 md:px-28 lg:px-36 xl:px-48'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-10'>
        <div>
          <BlurFade delay={0.25 * 1} inView>
            <h2 className='text-3xl font-bold'>Welcome to world of AI Assistants 🤖</h2>
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <p className='text-xl mt-2 text-muted-foreground'>Choose your AI Companion to Simplify Your Task 🚀</p>
          </BlurFade>
        </div>
        <Button
          disabled={selectedAssistant.length === 0 || loading}
          onClick={onClickContinue}
          className='h-12 px-6 text-base rounded-full'
        >
          {loading && <Loader2Icon className='animate-spin mr-2' />}
          Continue
        </Button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
        {AiAssistantsList.map((assistant, index) => (
          <BlurFade key={assistant.id} delay={0.25 + index * 0.05} inView>
            <div
              className={`relative p-3 rounded-xl border transition-all ease-in-out cursor-pointer hover:scale-105 ${
                IsAssistantSelected(assistant) ? 'ring-2 ring-primary' : 'hover:border-primary/50'
              }`}
              onClick={() => onSelect(assistant)}
            >
              <Checkbox
                className='absolute top-2 left-2 z-10'
                checked={IsAssistantSelected(assistant)}
              />
              <Image
                src={assistant.image}
                alt={assistant.title}
                width={600}
                height={600}
                className='rounded-xl w-full h-[200px] object-cover'
              />
              <h2 className='text-center font-bold text-lg mt-2'>{assistant.name}</h2>
              <p className='text-center text-sm text-muted-foreground'>{assistant.title}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  )
}

export default AIAssistants