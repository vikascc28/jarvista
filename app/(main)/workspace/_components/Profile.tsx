import React, { useContext, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { Loader2Icon, WalletCardsIcon } from "lucide-react";
import axios from "axios";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { PLAN_LIMITS } from "@/lib/constants";

declare global {
    interface Window {
        Razorpay: new (options: RazorpayCheckoutOptions) => { open: () => void };
    }
}

type RazorpayCheckoutResponse = {
    razorpay_payment_id?: string;
    razorpay_subscription_id?: string;
    razorpay_signature?: string;
};

type RazorpayCheckoutOptions = {
    key: string | undefined;
    subscription_id: string;
    name: string;
    description: string;
    image: string;
    handler: (resp: RazorpayCheckoutResponse) => Promise<void>;
    prefill: {
        name?: string;
        email?: string;
    };
    notes: Record<string, string>;
    theme: { color: string };
};

function Profile({ openDialog, setOpenDialog }: { openDialog: boolean; setOpenDialog: (open: boolean) => void }) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [maxToken, setMaxToken] = useState(0);
    const updateUserOrder = useMutation(api.users.updateTokens);

    useEffect(() => {
        setMaxToken(user?.orderId ? PLAN_LIMITS.proCredits : PLAN_LIMITS.freeCredits)
    }, [user])

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const GenerateSubscriptionId = async () => {
        try {
            setLoading(true);
            const result = await axios.post('/api/create-subscription', {
                uid: user?._id,
                email: user?.email,
            });
            MakePayment(result?.data?.id);
        } catch {
            toast.error('Failed to initialize subscription');
        } finally {
            setLoading(false);
        }
    }

    const MakePayment = (subscriptionId: string) => {
        if (!user?._id) {
            toast.error("User session is missing.");
            return;
        }

        const options: RazorpayCheckoutOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            subscription_id: subscriptionId,
            name: "Jarvista AI Assistant",
            description: "Pro Subscription Plan",
            image: '/logo.svg',
            handler: async function (resp: RazorpayCheckoutResponse) {
                if (resp?.razorpay_payment_id) {
                    const verification = await axios.post('/api/verify-subscription', resp);
                    if (!verification?.data?.verified) {
                        toast.error('Payment signature verification failed.');
                        return;
                    }

                    await updateUserOrder({
                        uid: user._id,
                        orderId: resp.razorpay_subscription_id,
                        credits: PLAN_LIMITS.proCredits,
                    });
                    toast('Thank You! Credits Added')
                }
            },
            prefill: {
                name: user?.name,
                email: user?.email,
            },
            notes: {

            },
            theme: {
                color: "#000000",
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    const cancelSubscription = async () => {
        if (!user?._id) {
            toast.error("User session is missing.");
            return;
        }
        try {
            await axios.post('/api/cancel-subscription', {
                subId: user?.orderId
            });
            await updateUserOrder({
                uid: user._id,
                credits: PLAN_LIMITS.freeCredits,
                orderId: undefined,
            });
            toast('Subscription cancelled');
            window.location.reload();
        } catch {
            toast.error('Unable to cancel subscription');
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            {/*<DialogTrigger>Open</DialogTrigger>*/}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ }</DialogTitle>
                    <DialogDescription>
                        <div>
                            <div className="flex gap-4 items-center">
                                <Image src={user?.picture || '/default-avatar.avif'} alt='user' width={150} height={150}
                                    className='w-[60px] h-[60px] rounded-full'
                                />
                                <div className='gap-4 items-center'>
                                    <h2 className='font-bold text-lg'>{user?.name}</h2>
                                    <h2 className='text-gray-500'>{user?.email}</h2>
                                </div>
                            </div>
                            <hr className="my-3"></hr>
                            <div className="flex flex-col gap-2">
                                <h2 className="font-bold">Token Usage</h2>
                                <h2>{user?.credits ?? 0}/{maxToken}</h2>
                                <Progress value={(((user?.credits ?? 0) / maxToken) * 100) || 0} />
                                <h2 className="flex justify-between font-bold mt-3 text-lg">Current Plan
                                    <span className="p-1 bg-gray-100 rounded-md px-2 font-normal">{!user?.orderId ? 'Free Plan' : 'Pro Plan'}</span></h2>
                            </div>

                            {!user?.orderId ?
                                <div className="p-4 border rounded-xl mt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="font-bold text-lg">Pro Plan</h2>
                                            <h2>500,000 Tokens</h2>
                                        </div>
                                        <h2 className="font-bold text-lg">$ {PLAN_LIMITS.monthlyPriceUsd}/month</h2>
                                    </div>
                                    <hr className="my-3" />
                                    <Button className="w-full" disabled={loading} onClick={GenerateSubscriptionId}> {loading ? <Loader2Icon className="animate-spin" /> : <WalletCardsIcon />}Upgrade ${PLAN_LIMITS.monthlyPriceUsd}</Button>
                                </div>
                                :
                                <Button className="mt-5 w-full" variant="secondary" onClick={cancelSubscription}>Cancel Subscription</Button>
                            }
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

export default Profile;