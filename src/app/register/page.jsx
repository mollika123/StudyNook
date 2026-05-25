"use client";

import { useRouter } from "next/navigation";


import { authClient } from "@/lib/auth-client";
// import { authClient } from "../../../lib/auth-client";
import {Check} from "@gravity-ui/icons";
import { Button, Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import Link from "next/link";
import { GrGoogle } from "react-icons/gr";


const Register = () => {
    const router = useRouter();

  const onSubmit =async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());
    console.log('form submitted with', userData);
    
    const { data, error } = await authClient.signUp.email({
      name: userData.name,
      email: userData.email,
     image:userData.image,
      password: userData.password,
      callbackURL:'/login'
      
    });
    console.log(data, error);
    if (error) {
      alert('Error signing up:'+error.message)
    }
    if (data) {
      alert("Register sucessfull")
    router.push("/");
      
    }
  };
    const handleGoogleSignIn = async () => {
      await authClient.signIn.social({
          provider: 'google'
      })
    }
  return (
    <div className="w-11/12 mx-auto py-9">
        <div className="flex justify-center items-center p-8">
 
    
          <Form className="flex flex-col gap-4 card shadow-xl p-7" onSubmit={onSubmit}>
     <h2 className="text-center font-bold">Please Register</h2>
        {/* name */}
         <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (value.length < 3) {
                return "Name must be at least 3 characters";
              }
              return null;
            }}
          >
            <Label>Name</Label>
            <Input name="name" placeholder="Enter Your Name" />
            <FieldError />
          </TextField>

        {/* email */}
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
        <Input name="email"    placeholder="Enter Your Email" />
        <FieldError />
          </TextField>
           <TextField
            
            name="image"
           
          >
            <Label>Photo</Label>
            <Input name="image" placeholder="Photo Url" />
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
        <Input name='password' placeholder="Enter your password" />
        <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
        <FieldError />
      </TextField>
      <div className="flex gap-2">
        <Button type="submit" className='bg-blue-600 w-full'>
          <Check />
         Register
        </Button>
       </div>
            
         
           <p className="text-center">Or</p>
        
          <Button onClick={handleGoogleSignIn} variant="outline" className={'w-full bg-blue-600 text-white'}><GrGoogle /> Register With Google</Button>
          
          <div className="text-center">
              <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href={"/login"} className="text-blue-500">
         <button className="px-3  text-blue-600 font-bold rounded-lg py-2">Login Here</button>
          </Link>
        </p></div>
        </Form>
         
    </div>
    </div>
  );
};

export default Register;