import { useState, SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { UserErrors } from "../../errors";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const validateInputs = (): boolean => {
    setUsername(username.trim());
    setPassword(password.trim());
    setConfirmPassword(confirmPassword.trim());

    if (!username || !password || !confirmPassword) return false;

    if (password !== confirmPassword) return false;

    return true;
  };

  const register = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        await axios.post("http://localhost:5000/user/register", {
          username,
          password,
        });

        // redirect to login page //
        navigate("/login");
      } catch (err) {
        if (err?.response?.data?.type === UserErrors.USERNAME_ALREADY_EXISTS) {
          alert("ERROR: Username already in use");
        } else {
          alert("ERROR");
        }
      }
    }
  };

  return (
    <div className="w-screen min-h-[calc(100vh-80px)] py-10 flex flex-col items-center gap-5 bg-blue-100">
      <h2 className="text-2xl text-center font-semibold">REGISTER</h2>

      <form
        onSubmit={register}
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

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-md"
          />
        </div>

        <button
          type="submit"
          className="m-auto px-2 py-1 font-medium border-[1px] border-black rounded-md bg-green-200 hover:bg-green-300"
        >
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 cursor-pointer">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
