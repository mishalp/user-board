import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { RotateCw } from "lucide-react"
import FormInput from "@/components/FormInput"
import { useLoginUserMutation } from "@/app/services/user"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/app/features/authSlice"

const formSchema = z.object({
    email: z.string({
        required_error: "Email is required"
    }).trim().email({
        message: "Enter a valid Email"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters"
    }),
})

export default function Login() {

    const [loginUser, { isLoading }] = useLoginUserMutation()
    const { toast } = useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values) => {
        try {
            const res = await loginUser(values).unwrap()

            localStorage.setItem('token', res.accessToken)
            dispatch(setCredentials({ accessToken: res.accessToken }))
            toast({
                title: "Success",
                description: "Login success",
                variant: "success",
            })
            navigate('/')
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
            <h2 className="text-2xl text-black font-bold  my-8">Log In</h2>
            <div className="bg-white p-6 min-w-[90vw] sm:min-w-[70vw] md:min-w-[28rem] flex flex-col gap-6 shadow rounded">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4 flex flex-col">
                        <FormInput name="email" label="Email" type="email" form={form} />
                        <FormInput name="password" label="Password" type="password" form={form} />

                        <Button disabled={isLoading} className="mt-3 bg-black" type="submit">
                            {isLoading ? <><RotateCw className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Submit"}
                        </Button>
                    </form>
                </Form>
                <p className="text-sm">{"Don't have an account?"} <Link className="text-blue-500" to='/signup'>Sign Up</Link></p>
            </div>
        </div>
    )
}
