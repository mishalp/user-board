import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { RotateCw } from "lucide-react"
import FormInput from "@/components/FormInput"
import { useCreateUserMutation } from "@/app/services/user"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    name: z.string({
        required_error: "name is required"
    }).min(2, {
        message: "name must be at least 2 characters.",
    }).max(20, {
        message: "name must be at most 20 characters"
    }).trim(),
    email: z.string({
        required_error: "Email is required"
    }).trim().email({
        message: "Enter a valid Email"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters"
    }),
})

export default function Signup() {

    const [createUser, { isLoading }] = useCreateUserMutation()
    const { toast } = useToast()
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values) => {
        try {
            await createUser(values).unwrap()

            toast({
                title: "Success",
                description: "User Created",
                variant: "success",
            })
            navigate('/login')
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Sign Up Error",
                description: error?.data?.message || "Somthing went wrong",
            })
        }
    }

    return (
        <div className="w-screen bg-slate-200 max-w-full min-h-screen bg-myprimary flex flex-col justify-center items-center p-4">
            <h2 className="text-2xl text-black font-bold  my-8">Sign Up</h2>
            <div className="bg-white p-6 min-w-[90vw] sm:min-w-[70vw] md:min-w-[28rem] flex flex-col gap-6 shadow rounded">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4 flex flex-col">
                        <FormInput name="name" label="Name" form={form} />
                        <FormInput name="email" label="Email" type="email" form={form} />
                        <FormInput name="password" label="Password" type="password" form={form} />

                        <Button disabled={isLoading} className="mt-3 bg-black" type="submit">
                            {isLoading ? <><RotateCw className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Submit"}
                        </Button>
                    </form>
                </Form>
                <p className="text-sm">Already have an account? <Link className="text-blue-500" to='/login'>Log in</Link></p>
            </div>
        </div>
    )
}
