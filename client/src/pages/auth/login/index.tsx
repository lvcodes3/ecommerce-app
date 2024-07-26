import { useState, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

import { UserErrors } from "../../errors";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [_, setCookies] = useCookies(["access_token"]);

  const sanitizeInputs = () => {
    setUsername(username.trim());
    setPassword(password.trim());
  };

  const login = async (e: SyntheticEvent) => {
    e.preventDefault();

    sanitizeInputs();

    try {
      const response = await axios.post("http://localhost:5000/user/register", {
        username,
        password,
      });

      setCookies("access_token", response?.data?.token);

      localStorage.setItem("userId", response?.data?.userId);

      alert("Login Completed");
    } catch (err) {
      if (err?.response?.data?.type === UserErrors.NO_USER_FOUND) {
        alert("ERROR: No user found");
      } else if (err?.response?.data?.type === UserErrors.WRONG_CREDENTIALS) {
        alert("ERROR: Invalid credentials");
      } else {
        alert("ERROR");
      }
    }
  };

  return (
    <div className="w-screen min-h-[calc(100vh-80px)] py-10 flex flex-col items-center gap-5 bg-blue-100">
      <h2 className="text-2xl text-center font-semibold">LOGIN</h2>

      <form
        onSubmit={login}
        className="w-[200px] md:w-[300px] lg:w-[400px] xl:w-[500px] flex flex-col items-start gap-5"
      >
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="username" className="font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="rounded-md"
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-md"
          />
        </div>

        <button
          type="submit"
          className="m-auto px-2 py-1 font-medium border-[1px] border-black rounded-md bg-green-200 hover:bg-green-300"
        >
          Login
        </button>
      </form>

      <p>
        Create an account?{" "}
        <Link to="/register" className="text-blue-500 cursor-pointer">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;