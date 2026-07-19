import { login } from "./actions"

const Login = async ({ searchParams }: { searchParams: Promise<{ error?: string }> }) => {
    const { error } = await searchParams;
    return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
            <form action={login} className="flex flex-col items-center gap-4">
                <h1 className="text-2xl font-semibold dark:text-white">Login</h1>
                <label className="text-zinc-500 dark:text-zinc-400" htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="border bg-white px-4 py-2 border-zinc-900 focus:border-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-white"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    className="cursor-pointer w-full bg-zinc-900 px-4 py-2 text-white dark:bg-white dark:text-black"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Login
