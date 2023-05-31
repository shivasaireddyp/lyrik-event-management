import React,{useState,useContext,useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import { loginContext } from '../../contexts/loginContext'
// import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
// import { useState } from 'react'

function Login() {

  const navigate = useNavigate();
  const location = useLocation();
  let [currentUser,error,userLoginStatus,loginUser,logoutUser]=useContext(loginContext)
  // if(location.state?.from){
  //   navigate(location.state.from)
  // }

   //error state
  let [pageHead, setPageHead] = useState("Login");

   //navigate
 
   //use form hook
   let {
     register,
     handleSubmit,
     formState: { errors },
   } = useForm();


   //user login
   const handleUserLogin=(userCredObj)=>{
  //  console.log(userCredObj)
    loginUser(userCredObj)
   }
   
  //  console.log(location?.state?.from.pathname)

   useEffect(()=>{
    if(userLoginStatus==true){
      if(location.state?.from){
        navigate(location.state.from)
      }
      else{
        navigate("/user-profile")
      }
      console.log("login successful")
    }
    else{

      console.log("not success")
    }
   },[userLoginStatus])

  //  if(location.state.from.pathname==='/user-profile/register-event'){
  //   // setPageHead("Login to Continue")
  //  }


  return (
    <div>
        {
          location?.state?.from.pathname=='/user-profile/register-event'?<h1 className='text-center'>Login to Continue</h1>:<h1 className='text-center'>Login</h1>
        }
     
      {/* form submission error */}
      {/* {error && error.length !== 0 && (
        <p className="display-3 text-danger text-center">{error}</p>
      )} */}
      {
        error?<p className="display-3 text-danger text-center">{error}</p>:""
      }
      {/* add user form */}
      <div className="row">
        <div className="col-11 col-sm-8 col-md-6 mx-auto">
          <form onSubmit={handleSubmit(handleUserLogin)}>
            {/* username */}
            <div className="mb-3">
              <label htmlFor="name">Userame</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="e.g. John"
                {...register("username", { required: true })}
              />
              {/* validation errors for name */}
              {errors.username?.type === "required" && (
                <p className="text-danger fw-bold fs-5">
                  * Username is required
                </p>
              )}
            </div>
            {/* password */}
            <div className="mb-3">
              <label htmlFor="name">Password</label>
              <input
                type="password"
                placeholder="*********"
                id="password"
                className="form-control"
                {...register("password", { required: true })}
              />
              {/* validation errors for name */}
              {errors.password?.type === "required" && (
                <p className="text-danger fw-bold fs-5">
                  * Password is required
                </p>
              )}
            </div>
            {/* submit button */}
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <p>dont have an account? <Link to="/register">sign up </Link>here</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login