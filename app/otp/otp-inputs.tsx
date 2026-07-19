"use client"

import { useRef } from "react";

const OtpInputs = ({ digits }: { digits: number }) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleInput = (index: number, e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        input.value = input.value.replace(/\D/g, "").slice(-1);
        if (input.value && index < digits - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, digits);
        if (!pasted) return;
        e.preventDefault();
        pasted.split("").forEach((char, i) => {
            const input = inputsRef.current[i];
            if (input) input.value = char;
        });
        inputsRef.current[Math.min(pasted.length, digits - 1)]?.focus();
    };

    return (
        <div className="flex gap-2">
            {[...Array(digits)].map((_, index) => (
                <input
                    key={index}
                    ref={el => { inputsRef.current[index] = el; }}
                    name="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    pattern="[0-9]"
                    required
                    autoFocus={index === 0}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    onInput={e => handleInput(index, e)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-xl bg-white focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
            ))}
        </div>
    );
};

export default OtpInputs;
