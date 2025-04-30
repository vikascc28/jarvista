"use client";
import React, {useContext, useState} from 'react';
import EmptyChatState from "@/app/(main)/workspace/_components/EmptyChatState";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Send} from 'lucide-react';
import AiModelOptions from "@/services/AiModelOptions";
import axios from "axios";
import {AssistantContext} from "@/context/AssistantContext";

function ChatUi() {
    const [input, setInput] = useState<string>('');
    const {assistant} = useContext(AssistantContext);
    const onSendMessage = async () => {
        const AIModel = AiModelOptions.find(item => item.name == assistant.aiModelId)

        const result = await axios.post('api/eden-ai-model', {
            provider: AIModel?.edenAi,
            userInput: input
        });
        console.log(result.data);
        setInput('');
    };

    return (
        <div className='mt-20 p-6 relative h-[88vh]'>
            <EmptyChatState/>

            <div className='flex justify-between p-5 gap-5 absolute bottom-5 w-[92%]'>
                <Input placeholder='Start Typing Here...'
                       value={input}
                       onChange={(event) => setInput(event.target.value)}
                       onKeyPress={(e) => {
                           if (e.key === 'Enter') {
                               onSendMessage();
                           }
                       }}
                />
                <Button onClick={onSendMessage}>
                    <Send/>
                </Button>
            </div>
        </div>
    );
}
    export default ChatUi;
