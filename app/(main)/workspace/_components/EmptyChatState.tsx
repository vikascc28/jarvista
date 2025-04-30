import {SparklesText} from '@/components/magicui/sparkles-text';
import {ChevronRight} from 'lucide-react';
import React, {useContext} from 'react';
import {AssistantContext} from '@/context/AssistantContext';
import {BlurFade} from "@/components/magicui/blur-fade";

function EmptyChatState() {
    const {assistant, setAssistant} = useContext(AssistantContext);

    return (
        <div className='flex flex-col items-center'>
            <SparklesText className='text-4xl text-center'>"How Can I Assist You?"</SparklesText>
            <div className='mt-7'>
                {assistant?.sampleQuestions.map((suggestion: string, index: number) => (
                    <BlurFade delay={0.25} key={suggestion}>
                        <div key={index}>
                            <h2 className='p4 text-lg border mt-1 rounded-xl
                        hover:bg-gray-200 cursor-pointer flex items-center justify-between gap-10
                        '>{suggestion}
                                <ChevronRight/>
                            </h2>
                        </div>
                    </BlurFade>
                ))}
            </div>
        </div>
    )
}

export default EmptyChatState;
