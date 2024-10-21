/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/app/redux/features/taskApi/taskApi";
import { useForm } from "react-hook-form";
import { useState } from "react";

const TaskForm = ({ task, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: task || {},
  });
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [selectedTags, setSelectedTags] = useState(task?.tags || []);

  // Custom validation for tags
  const validateTags = () => selectedTags.length > 0;

  // Custom validation for due date
  const isDueDateInFuture = (dueDate) => {
    const today = new Date();
    const selectedDate = new Date(dueDate);
    return selectedDate > today;
  };

  const onSubmit = async (data: any) => {
    // Assign selected tags to the form data
    data.tags = selectedTags;

    // Check if at least one tag is selected
    if (!validateTags()) {
      alert("At least one tag must be selected.");
      return; // Exit early if validation fails
    }

    // Check if due date is in the future
    if (!isDueDateInFuture(data.dueDate)) {
      alert("Due date must be in the future.");
      return; // Exit early if validation fails
    }

    // Proceed to create or update the task
    if (task) {
      await updateTask({ id: task._id, data });
    } else {
      data.completed = false;
      data.reminder = false; // Reset reminder flag for new task
      await createTask(data);
    }

    reset();
    onClose();
  };

  const handleTagChange = (e) => {
    const tagValue = e.target.value;
    if (!selectedTags.includes(tagValue) && tagValue) {
      setSelectedTags([...selectedTags, tagValue]); // Add new tag
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove)); // Remove tag
  };

  return (
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
  {/* Task Name */}
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">Task Name</label>
    <input
      type="text"
      {...register("name", { required: true })}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter task name"
    />
    {errors.name && (
      <span className="text-sm text-red-500 mt-1">This field is required</span>
    )}
  </div>

  {/* Description */}
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">Description</label>
    <textarea
      {...register("description", { required: true })}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter task description"
      rows="4"
    />
    {errors.description && (
      <span className="text-sm text-red-500 mt-1">This field is required</span>
    )}
  </div>

  {/* Due Date */}
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">Due Date</label>
    <input
      type="date"
      {...register("dueDate", { required: true })}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors.dueDate && (
      <span className="text-sm text-red-500 mt-1">This field is required</span>
    )}
  </div>

  {/* Priority */}
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">Priority</label>
    <select
      {...register("priority", { required: true })}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select priority</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
    {errors.priority && (
      <span className="text-sm text-red-500 mt-1">This field is required</span>
    )}
  </div>

  {/* Selected Tags */}
  <div className="flex flex-wrap gap-2">
    {selectedTags.map((tag, index) => (
      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center">
        {tag}
        <button
          type="button"
          onClick={() => removeTag(tag)}
          className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
        >
          &times;
        </button>
      </span>
    ))}
  </div>

  {/* Tags */}
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">Tags</label>
    <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleTagChange}>
      <option value="">Select a tag</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Shopping">Shopping</option>
      <option value="All">All</option>
    </select>
    {!validateTags() && (
      <span className="text-sm text-red-500 mt-1">At least one tag must be selected</span>
    )}
  </div>

  {/* Action Buttons */}
  <div className="flex justify-end gap-4">
    <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-200">
      Submit
    </button>
    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 transition duration-200">
      Cancel
    </button>
  </div>
</form>


  );
};

export default TaskForm;
