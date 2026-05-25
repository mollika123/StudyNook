"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Check } from "@gravity-ui/icons";
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import { GrGoogle } from "react-icons/gr";

export default function LogInPage() {
    const router = useRouter();
  const onSubmit =async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());
    console.log('form submitted with', userData);

   const { data, error } = await authClient.signIn.email({
  
      email: userData.email,
   
      password: userData.password,
      callbackURL:'/'
      
    });

    console.log({ data, error });
     if (error) {
      alert(error.message);
      return;
    }

 

    // 🔥 redirect MUST be here
    router.push("/");
  };
  

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
        provider: 'google'
    })
  }



  return (
    <div className="w-11/12 mx-auto  py-10 mt-5">
            <div className="flex   justify-center items-center p-8">
    

        <Form className="flex card shadow-xl mx-auto flex-col gap-4" onSubmit={onSubmit}>
            <h1 className="text-center text-2xl font-bold">Login</h1>
        <TextField
          isRequired
          name="email"
          type="email"
          validate={(value) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
              return "Please enter a valid email address";
            }

            return null;
          }}
        >
          <Label>Email</Label>
          <Input placeholder="Enter Your Name" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          minLength={8}
          name="password"
          type="password"
          validate={(value) => {
            if (value.length < 8) {
              return "Password must be at least 8 characters";
            }
            if (!/[A-Z]/.test(value)) {
              return "Password must contain at least one uppercase letter";
            }
            if (!/[0-9]/.test(value)) {
              return "Password must contain at least one number";
            }

            return null;
          }}
        >
          <Label>Password</Label>
          <Input placeholder="Enter your password" />
          <Description>
            Must be at least 8 characters with 1 uppercase and 1 number
          </Description>
          <FieldError />
        </TextField>

        <div className="flex gap-2">
          <Button type="submit" className='w-full bg-blue-600'>
    
            Login
          </Button>
         
     
        </div>
         <p className="text-center">Or</p>

          <Button onClick={handleGoogleSignIn} className={'w-full bg-blue-600'}><GrGoogle /> Log In With Google</Button>
           <div className="text-center mt-4">
          <p className="">
          Don't have an account?{" "}
          <Link href={"/register"} className="text-blue-500">
            <button>Register</button>
          </Link>
        </p></div>
      </Form>

      
       
        </div>
    </div>
  );
}