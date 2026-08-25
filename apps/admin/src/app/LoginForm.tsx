"use client";

import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) window.location.reload();
    else setError("Invalid password");
  }

  return <main><h1>Sign in to your account</h1><form onSubmit={submit}>
    <label htmlFor="password">Password</label>
    <input id="password" name="password" type="password" required />
    <button type="submit">Sign In</button>
    {error && <p role="alert">{error}</p>}
  </form></main>;
}