'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/context/AuthContext'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { ASSISTANT } from '../../ai-assistants/page'
import Image from 'next/image'
import { AssistantContext } from '@/context/AssistantContext'

function AssistantList() {
    const { user } = useContext(AuthContext)
    const convex = useConvex()
    const [assistantList, setAssistantList] = useState<ASSISTANT[]>([])
    const { assistant, setAssistant } = useContext(AssistantContext)

    const GetUserAssistants = async () => {
        try {
            const result = await convex.query(api.userAiAssistants.GetAllUserAssistants, {
                uid: user?._id
            })
            console.log(result)
            setAssistantList(result)
        } catch (error) {
            console.log("Error fetching assistants", error)
        }
    }

    useEffect(() => {
        if (user && assistant == null) {
            GetUserAssistants()
        }
    }, [user, assistant])

    return (
        <div className='p-5 bg-secondary border-r-[1px] h-screen overflow-y-auto relative'>
            <h2>Your personal AI Assistant</h2>
            <Button className='w-full mt-3'>+ Add New Assistant</Button>
            <Input className='bg-white mt-3' placeholder='search' />
            <div className='mt-5'>
                {assistantList.map((assistant_, index) => (
                    <div
                        key={index}
                        className={`p-2 flex gap-3 items-center hover:bg-gray-200 rounded-xl 
                            cursor-pointer hover:dark:bg-slate-700 mt-2
                            ${assistant_.id === assistant?.id ? 'bg-gray-200' : ''}`}
                        onClick={() => setAssistant(assistant_)}
                    >
                        <Image
                            src={assistant_.image}
                            alt={assistant_.name}
                            width={60}
                            height={60}
                            className='rounded-xl w-[60px] h-[60px]'
                        />
                        <div>
                            <h2 className='font-bold'>{assistant_.name}</h2>
                            <h2 className='text-gray-600 text-sm dark:text-gray-300'>{assistant_.title}</h2>
                        </div>
                    </div>
                ))}
            </div>
            <div
                className='absolute bottom-10 flex gap-3 items-center
                hover:bg-gray-200 w-[87%] p-2 rounded-xl cursor-pointer'>
                <Image
                    alt="User Avatar"
                    width={35}
                    height={35}
                    className='rounded-full'
                    src={user?.image || '/default-avatar.png'}
                />
                <div>
                    <h2 className='font-bold'>{user?.name}</h2>
                    <h2 className='text-gray-400 text-sm'>{user?.orderId ? 'Pro Plan' : 'Free Plan'}</h2>
                </div>
            </div>
        </div>
    )
}

export default AssistantList
