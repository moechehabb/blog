import { verifyOtp } from "./actions";
import OtpInputs from "./otp-inputs";

const OTP_DIGITS = 6;

const OTP = async ({ searchParams }: { searchParams: Promise<{ email?: string; error?: string }> }) => {
    const { email = "", error } = await searchParams;
    return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
            <form action={verifyOtp} className="flex flex-col items-center gap-4">
                <h1 className="text-2xl font-semibold dark:text-white">Login</h1>
                <p className="text-zinc-500 dark:text-zinc-400">We sent an OTP to {email || "your email"}.</p>
                <input type="hidden" name="email" value={email} />
                <OtpInputs digits={OTP_DIGITS} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-zinc-900 px-4 py-2 text-white dark:bg-white dark:text-black"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default OTP
