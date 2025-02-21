import React, { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const SocialLogin = () => {
  const { googleSignIn } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    googleSignIn().then((result) => {
      console.log(result.user);
      const userInfo = {
        email: result.user?.email,
        displayName: result.user?.displayName,
      };
      axiosPublic.post("/users", userInfo).then((res) => {
        console.log(res.data);
        navigate("/addTask");
      });
    });
  };

  return (
    <div>
      <div className="flex justify-center mt-20">
        <button className="btn btn-neutral" onClick={handleGoogleSignIn}>
          <FaGoogle className="mr-2" /> Login with google
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
