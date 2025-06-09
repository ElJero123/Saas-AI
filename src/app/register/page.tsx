import FormRegister from "@/components/Forms/FormRegister";

export default function Page() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Sign up</h1>
            <FormRegister />
        </main>
    )
}