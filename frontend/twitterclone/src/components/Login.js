import React, { useState } from 'react';
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from '../redux/userSlice';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Added loading state

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    if (isLogin) {
      // Login
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/login`,
          { email, password },
          {
            headers: {
              'Content-Type': "application/json"
            },
            withCredentials: true
          }
        );
        if (res.data.success) {
          dispatch(getUser(res?.data?.user));
          navigate("/");
          toast.success(res.data.message);
          // Reset form fields
          setEmail("");
          setPassword("");
        } else {
          toast.error(res.data.message || "Login failed.");
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
        console.error(error);
      }
    } else {
      // Signup
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/register`,
          { name, username, email, password },
          {
            headers: {
              'Content-Type': "application/json"
            },
            withCredentials: true
          }
        );
        if (res.data.success) {
          setIsLogin(true);
          toast.success(res.data.message);
          // Reset form fields
          setName("");
          setUsername("");
          setEmail("");
          setPassword("");
        } else {
          toast.error(res.data.message || "Signup failed.");
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
        console.error(error);
      }
    }
    setLoading(false); // End loading
  }

  const loginSignupHandler = () => {
    setIsLogin(!isLogin);
    // Optionally reset form fields when toggling
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-gray-100'> {/* Added background color for better contrast */}
      <div className='flex flex-col md:flex-row items-center justify-evenly w-[80%] max-w-4xl bg-white p-8 rounded-lg shadow-lg'> {/* Enhanced responsiveness and styling */}
        <div className='mb-8 md:mb-0'>
          <img
            className='ml-5'
            width={"300px"}
            src="https://www.edigitalagency.com.au/wp-content/uploads/new-Twitter-logo-x-black-png-1200x1227.png"
            alt="twitter-logo"
          />
        </div>
        <div className='w-full md:w-1/2'>
          <div className='my-5'>
            <h1 className='font-bold text-6xl text-gray-800'>Happening now.</h1>
          </div>
          <h1 className='mt-4 mb-2 text-2xl font-bold text-gray-700'>
            {isLogin ? "Login" : "Signup"}
          </h1>
          <form onSubmit={submitHandler} className='flex flex-col w-full'>
            {
              !isLogin && (
                <>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Name'
                    className="outline-blue-500 border border-gray-300 px-3 py-2 rounded-full my-1 font-semibold focus:ring-2 focus:ring-blue-500"
                    required={!isLogin}
                  />
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Username'
                    className="outline-blue-500 border border-gray-300 px-3 py-2 rounded-full my-1 font-semibold focus:ring-2 focus:ring-blue-500"
                    required={!isLogin}
                  />
                </>
              )
            }
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              className="outline-blue-500 border border-gray-300 px-3 py-2 rounded-full my-1 font-semibold focus:ring-2 focus:ring-blue-500"
              required
            />
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className="outline-blue-500 border border-gray-300 px-3 py-2 rounded-full my-1 font-semibold focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className='bg-[#1D9BF0] border-none py-2 my-4 rounded-full text-lg text-white hover:bg-[#1A8CD8] transition duration-300'
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
            </button>
            <h1 className='text-center text-gray-600'>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                onClick={loginSignupHandler}
                className='font-bold text-blue-600 cursor-pointer hover:underline'
              >
                {isLogin ? "Signup" : "Login"}
              </span>
            </h1>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
