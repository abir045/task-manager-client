import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthContext } from "../Providers/AuthProvider";
import Select from "react-select";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import ViewTasks from "./ViewTasks";

const AddTask = () => {
  const { register, handleSubmit, reset, control } = useForm();
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const onSubmit = (data) => {
    console.log(data);
    const task = {
      title: data.title,
      description: data.description,
      category: data.category,
    };

    axiosPublic.post(`/users/${user.email}/tasks`, task).then((res) => {
      if (res.data.modifiedCount) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Task added`,
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
      }
    });
  };

  const options = [
    { value: "to-do", label: "to-do" },
    { value: "in-progress", label: "in-progress" },
    { value: "done", label: "done" },
  ];

  return (
    <div>
      <h2 className="text-center text-3xl font-bold">Add Task</h2>

      <div className="flex justify-center mt-20">
        <form
          className="w-full container mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="fieldset ">
            <legend className="fieldset-legend">Task Title?</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Type your task title"
              {...register("title", { required: true })}
            />
          </fieldset>

          <fieldset className="fieldset ">
            <legend className="fieldset-legend">Enter Description</legend>
            <textarea
              className="textarea h-24 w-full"
              placeholder="details"
              {...register("description", { required: true })}
            ></textarea>
            {/* <div className="fieldset-label">Optional</div> */}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Category</legend>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={options}
                  value={options.find((option) => option.value === field.value)}
                  onChange={(option) => field.onChange(option.value)}
                  className="mt-4"
                />
              )}
            />
          </fieldset>

          <button className="btn btn-neutral mt-4" type="submit">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
