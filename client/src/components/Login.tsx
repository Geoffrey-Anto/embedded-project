// pages/login.js or components/Login.js
"use client";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  // States for username and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    console.log(email);

    if (!email || !password) {
      alert("Please provide all fields");
      return;
    }

    const data = {
      email,
      password,
    };

    try {
      const response = await api.post("/person/login", data);
      const { token, person, success } = response.data;

      if (success) {
        router.push("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-form">
          <h2>CUSTOMER LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="icon-user"></i>
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group text-black">
              <i className="icon-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
