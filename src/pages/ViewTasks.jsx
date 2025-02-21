import React, { useContext, useRef } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../Providers/AuthProvider";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ViewTasks = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  const { data: taskData = [], refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user.email}/tasks`);
      return res.data;
    },
  });

  const handleMoveTask = async (dragIndex, hoverIndex, category) => {
    // Get tasks in this category and sort them by current order
    const columnTasks = taskData
      .filter((task) => task.category === category)
      .sort((a, b) => a.order - b.order);

    if (
      dragIndex < 0 ||
      dragIndex >= columnTasks.length ||
      hoverIndex < 0 ||
      hoverIndex >= columnTasks.length
    ) {
      return; // Invalid indices
    }

    // Create a copy of the tasks
    const newTasks = [...columnTasks];

    // Remove the dragged task
    const [movedTask] = newTasks.splice(dragIndex, 1);

    // Insert it at the new position
    newTasks.splice(hoverIndex, 0, movedTask);

    // Update order values
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    // Update the backend
    try {
      for (const task of updatedTasks) {
        await axiosPublic.put(
          `/users/${user.email}/tasks/${task.taskId}`,
          task
        );
      }
      refetch();
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      // Find the task to update
      const taskToUpdate = taskData.find((task) => task.taskId === taskId);
      if (!taskToUpdate) return;

      // Create updated task object
      const updatedTask = { ...taskToUpdate, category: newStatus };

      // Send update to server
      await axiosPublic.put(
        `/users/${user.email}/tasks/${taskId}`,
        updatedTask
      );

      // Refetch tasks to update UI
      refetch();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const todoTasks = taskData
    .filter((task) => task.category === "to-do")
    .sort((a, b) => a.order - b.order);

  const inProgressTasks = taskData
    .filter((task) => task.category === "in-progress")
    .sort((a, b) => a.order - b.order);

  const doneTasks = taskData
    .filter((task) => task.category === "done")
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      <h3>{taskData.length}</h3>
      <DndProvider backend={HTML5Backend}>
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Task Board</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To-Do Column */}
            <TaskColumn
              title="To Do"
              tasks={todoTasks}
              category="to-do"
              onDropTask={handleUpdateTaskStatus}
              onMoveTask={handleMoveTask}
            />

            {/* In Progress Column */}
            <TaskColumn
              title="In Progress"
              tasks={inProgressTasks}
              category="in-progress"
              onDropTask={handleUpdateTaskStatus}
              onMoveTask={handleMoveTask}
            />

            {/* Done Column */}
            <TaskColumn
              title="Done"
              tasks={doneTasks}
              category="done"
              onDropTask={handleUpdateTaskStatus}
              onMoveTask={handleMoveTask}
            />
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

const TaskCard = ({ task, index, category, onMoveTask }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: {
      id: task.taskId,
      index,
      category,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      // Don't replace items with themselves
      if (item.id === task.taskId) {
        return;
      }

      // Only handle reordering within the same column
      if (item.category !== category) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the item's height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Update the index in the item being dragged for later use
      item.index = hoverIndex;
    },
    drop(item) {
      if (item.category === category && item.index !== index) {
        onMoveTask(item.index, index, category);
      }
    },
  });

  // Initialize drag and drop refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`p-4 mb-3 rounded-lg shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      } bg-white hover:shadow-md transition-all cursor-move`}
    >
      <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
    </div>
  );
};

const TaskColumn = ({ title, tasks, category, onDropTask, onMoveTask }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: "TASK",
    drop(item, monitor) {
      // Only handle if not already handled by a card
      if (!monitor.didDrop() && item.category !== category) {
        onDropTask(item.id, category);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={`bg-gray-50 rounded-lg p-4 min-h-96 ${
        isOver ? "bg-gray-100 border-2 border-dashed border-gray-300" : ""
      }`}
    >
      <h3 className="font-bold text-xl mb-4 flex items-center justify-between">
        <span>{title}</span>
        <span className="bg-gray-200 text-gray-800 rounded-full h-6 w-6 flex items-center justify-center text-sm">
          {tasks.length}
        </span>
      </h3>

      <div>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No tasks in this column
          </div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.taskId}
              task={task}
              index={index}
              category={category}
              onMoveTask={onMoveTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ViewTasks;
