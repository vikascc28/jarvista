"use client";
import React, { useEffect, useContext, useRef, useState } from 'react';
import EmptyChatState from "@/app/(main)/workspace/_components/EmptyChatState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon, Send } from 'lucide-react';
import AiModelOptions from "@/services/AiModelOptions";
import axios from "axios";
import { AssistantContext } from "@/context/AssistantContext";
import Image from 'next/image';

type MESSAGE = {
    role: string,
    content: string
}
function ChatUi() {
    const [input, setInput] = useState<string>('');
    const { assistant, setAssistant } = useContext(AssistantContext);
    const [messages, setMessages] = useState<MESSAGE[]>([]);
    const [loading, setLoading] = useState(false);
    const chatRef = useRef<any>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        } [messages]
    });

    useEffect(() => {
        setMessages([]); // Clear messages when assistant changes
    }, [assistant?.id]);

    const onSendMessage = async () => {
        setLoading(true);
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        },
        {
            role: 'assistant',
            content: 'Loading...'
        }
        ]);

        const userInput = input;
        setInput('');
        const AIModel = AiModelOptions.find(item => item.name == assistant.aiModelId)

        const result = await axios.post('api/eden-ai-model', {
            provider: AIModel?.edenAi,
            userInput: userInput + ":" + assistant?.instruction + ":" + assistant?.userInteraction,
            aiResp: messages[messages?.length - 1]?.content
        });
        setLoading(false);
        setMessages(prev => prev.slice(0, -1));
        setMessages(prev => [...prev, result.data]);
        setInput('');
    };

    return (
        <div className='mt-20 p-6 relative h-[88vh]'>
            {messages?.length == 0 && <EmptyChatState />}

            <div ref={chatRef} className='h-[74vh] overflow-scroll scrollbar-hide'>
                {messages.map((message, index) => (
                    <div key={index}
                        className={`flex mb-2${message.role == 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className='flex gap-3'>
                            {message.role === 'assistant' && (
                                <Image
                                    src={assistant?.image}
                                    alt="assistant"
                                    width={100}
                                    height={100}
                                    className="w-[30px] h-[30px] rounded-full object-cover"
                                />
                            )}

                            <div className={`p-3 rounded-lg flex gap-2
                                ${message.role == 'user' ? 'bg-gray-200 text-black rounded-lg' :
                                    'bg-gray-50 text-black'
                                }
                                    `}>
                                {loading && messages?.length - 1 == index && <Loader2Icon className='animate-spin' />}
                                <h2>{message.content}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-between p-5 gap-5 absolute bottom-5 w-[92%]'>
                <Input placeholder='Start Typing Here...'
                    value={input}
                    disabled={loading}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            onSendMessage();
                        }
                    }}
                />
                <Button disabled={loading}>
                    <Send />
                </Button>
            </div>
        </div >
    );
}
export default ChatUi;
