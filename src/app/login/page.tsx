import FormLogin from "@/components/Forms/FormLogin";

export default function Page() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Login</h1>
            <FormLogin />
        </main>
    )
}