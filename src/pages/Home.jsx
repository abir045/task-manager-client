import React from "react";
import SocialLogin from "../components/SocialLogin";

const Home = () => {
  return (
    <div>
      <h3 className="text-center font-bold text-3xl">Task Manager</h3>

      <div className="mt-20">
        <SocialLogin />
      </div>
    </div>
  );
};

export default Home;
