"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import useToaster from "@/components/hooks/useToaster";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { useSendLoginOTPMutation } from "@/store/auth";

export default function LoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const { errorToaster, successToaster } = useToaster();

    const [OTPSend, { isLoading: otpSendLoading }] = useSendLoginOTPMutation();

    const handleOTPSend = async (e) => {
        e.preventDefault();
        try {
            const res = await OTPSend({ phone }).unwrap();
            if (res) {
                successToaster("OTP sent successfully!");
                setOtpSent(true);
            }
        } catch (err) {
            errorToaster(err?.data?.message || "Failed to send OTP.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await signIn("credentials", {
                phone,
                otp,
                redirect: false,
            });

            if (result?.error) {
                errorToaster("Invalid OTP.");
            } else {
                successToaster("Login successful!");
                router.replace("/dashboard");
            }
        } catch {
            errorToaster("Login failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-2 text-center">
                    <h1 className="text-2xl font-bold text-[#042A55]">Admin Panel</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Sign in to your admin account
                    </p>
                </div>

                {!otpSent ? (
                    <form onSubmit={handleOTPSend} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Phone
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    placeholder="01889010237"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#042A55] focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={otpSendLoading}
                            className={`w-full bg-[#042A55] hover:enabled:bg-[#063C76] hover:cursor-pointer text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${otpSendLoading ? "cursor-not-allowed" : ""}`}
                        >
                            {otpSendLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Sending OTP...
                                </>
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                            <CheckCircle size={16} />
                            <span>OTP sent to {phone}</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Enter 5-Digit OTP
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={5}
                                placeholder="00000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm tracking-widest text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#042A55] focus:border-transparent"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={otp.length !== 5}
                            className={`w-full bg-[#042A55] hover:enabled:bg-[#063C76] hover:cursor-pointer text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${otp.length !== 5 ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setOtpSent(false);
                                setOtp("");
                            }}
                            className="w-full text-sm text-[#042A55] hover:underline cursor-pointer"
                        >
                            Change Phone Number
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
