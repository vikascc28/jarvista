'use client';
import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { AssistantContext } from '@/context/AssistantContext';
import AddNewAssistant from './AddNewAssistant';
import Profile from './Profile';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOut, UserCircle2 } from 'lucide-react';

function AssistantList() {
    const { user, logout } = useContext(AuthContext);
    const { assistant, setAssistant } = useContext(AssistantContext);
    const [openProfile, setOpenProfile] = useState(false);

    const assistantList = useQuery(
        api.userAiAssistants.GetAllUserAssistants,
        user?._id ? { uid: user._id } : "skip"
    );

    return (
        <div className="p-5 bg-gray-50 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 h-screen overflow-y-auto relative text-gray-900 dark:text-gray-100">
            <h2 className="text-lg font-semibold text-center">Your Personal AI Assistant</h2>

            <AddNewAssistant>
                <Button className="w-full mt-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white">
                    Add New Assistant
                </Button>
            </AddNewAssistant>

            <div className="mt-6 space-y-3">
                {!assistantList && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Loading assistants...
                    </p>
                )}
                {assistantList?.map((assistant_) => (
                    <div
                        key={assistant_.id}
                        className={`p-3 flex gap-3 items-center rounded-lg border transition-colors cursor-pointer 
              ${assistant_.id === assistant?.id
                                ? 'bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-600'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent'
                            }`}
                        onClick={() => setAssistant(assistant_)}
                    >
                        <Image
                            src={assistant_.image || '/fallback-avatar.jpg'}
                            alt={assistant_.name}
                            width={50}
                            height={50}
                            className="rounded-md w-[50px] h-[50px] object-cover"
                        />
                        <div className="flex flex-col justify-center">
                            <span className="font-medium">{assistant_.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{assistant_.title}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* User Profile & Logout */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div
                        className="absolute bottom-16 w-[90%] p-3 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center gap-3 cursor-pointer"
                        tabIndex={0}
                    >
                        <Image
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full border border-gray-400 dark:border-gray-600"
                            src={user?.picture || '/default-avatar.avif'}
                        />
                        <div>
                            <h2 className="font-semibold text-sm">{user?.name}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user?.orderId ? 'Pro Plan' : 'Free Plan'}
                            </p>
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 text-black dark:text-white border dark:border-gray-700">
                    <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenProfile(true)} className="cursor-pointer">
                        <UserCircle2 className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 dark:text-red-400">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Profile openDialog={openProfile} setOpenDialog={setOpenProfile} />
        </div>
    );
}

export default AssistantList;
