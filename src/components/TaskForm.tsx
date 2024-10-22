/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useCreateTaskMutation,
  useGetSingleTaskQuery,
  useUpdateTaskMutation,
} from "@/app/redux/features/taskApi/taskApi";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { TTask } from "@/types/taskTypes";
// import { toast } from "sonner";
// type MutationError = {
//   message?: string; // Optional message field
// };

const TaskForm = ({ task, onClose }: { task?: TTask; onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: task || {},
  });
  const [createTask ] = useCreateTaskMutation();

  const [updateTask] = useUpdateTaskMutation();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data, isLoading, error } = useGetSingleTaskQuery(
    { id: task?._id },
    { skip: task?._id ? false : true }
  );
// console.log(isSuccess)
  useEffect(() => {
    if (data) {
      const tData: TTask = data;
      setSelectedTags([...tData.tags]);
    }
  }, [data]);

  // Custom validation for tags
  const validateTags = () => selectedTags.length > 0;

  // Custom validation for due date
  const isDueDateInFuture = (dueDate: string) => {
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

  const handleTagChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tagValue = e.target.value;
    if (!selectedTags.includes(tagValue) && tagValue) {
      setSelectedTags([...selectedTags, tagValue]); // Add new tag
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove)); // Remove tag
  };

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error fetching tasks.</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="input-group">
        <label className="label">Task Name</label>
        <input
          type="text"
          {...register("name", { required: true })}
          className="input"
          placeholder="Enter task name"
        />
        {errors.name && (
          <span className="error-message">This field is required</span>
        )}
      </div>

      <div className="input-group">
        <label className="label">Due Date</label>
        <input
          type="date"
          {...register("dueDate", { required: true })}
          className="input"
        />
        {errors.dueDate && (
          <span className="error-message">This field is required</span>
        )}
      </div>

      <div className="input-group">
        <label className="label">Priority</label>
        <select {...register("priority", { required: true })} className="input">
          <option value="">Select priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.priority && (
          <span className="error-message">This field is required</span>
        )}
      </div>

      <div className="input-group">
        <label className="label">Tags</label>
        <select className="input" onChange={handleTagChange}>
          <option value="">Select a tag</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
          <option value="All">All</option>
        </select>
      </div>

      <div className="tag-container">
        {selectedTags?.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="remove-tag-button"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      <div className="input-group full-width">
        <label className="label">Description</label>
        <textarea
          {...register("description", { required: true })}
          className="input textarea"
          placeholder="Enter task description"
          rows={4}
        />
        {errors.description && (
          <span className="error-message">This field is required</span>
        )}
      </div>

      <div className="action-buttons">
        <button type="submit" className="submit-button">
          Submit
        </button>
        <button type="button" onClick={onClose} className="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
