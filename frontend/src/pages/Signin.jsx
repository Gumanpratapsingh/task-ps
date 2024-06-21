import React, { useState } from 'react';
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const response = await axios.post('https://evening-ridge-00209-ff80fa958fb2.herokuapp.com/tasks/signin', {
                email,
                password
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId); // Store user ID in local storage
            localStorage.setItem("email", response.data.email); // Store user email in local storage
            navigate("/tasks"); // Adjust the redirect as needed
        } catch (error) {
            console.error("Sign in failed:", error.response.data.message);
        }
    };

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox value={email} onChange={e => setEmail(e.target.value)} placeholder="harkirat@gmail.com" label={"Email"} />
        <InputBox value={password} onChange={e => setPassword(e.target.value)} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={handleSignIn} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}