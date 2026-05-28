import React from 'react'
import AssistantList from './_components/AssistantList'
import AssistantSettings from './_components/AssistantSettings'
import ChatUi from './_components/ChatUi'

function Workspace() {
    return (
        <div className='h-screen fixed w-full'>
            <div className='grid grid-cols-1 md:grid-cols-5'>
                <div className='md:block md:col-span-1'>
                    <AssistantList />
                </div>
                <div className='md:col-span-3'>
                    <ChatUi />
                </div>
                <div className='md:col-span-1'>
                    <AssistantSettings />
                </div>
            </div>
        </div>
    )
}

export default Workspace
