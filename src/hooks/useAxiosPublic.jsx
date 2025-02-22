import axios from "axios";
import React from "react";

const axiosPublic = axios.create({
  baseURL: "https://task-management-server-seven-blush.vercel.app/",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
