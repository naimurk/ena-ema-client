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
    <form onSubmit={handleSubmit(onSubmit)} className="task-form">
      <div className="form-group">
        <label>Task Name</label>
        <input
          type="text"
          {...register("name", { required: true })}
          className="input-field"
        />
        {errors.name && (
          <span className="error-message">This field is required</span>
        )}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          {...register("description", { required: true })}
          className="input-field"
        />
        {errors.description && (
          <span className="error-message">This field is required</span>
        )}
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          {...register("dueDate", { required: true })}
          className="input-field"
        />
        {errors.dueDate && (
          <span className="error-message">This field is required</span>
        )}
      </div>

      <div className="form-group">
        <label>Priority</label>
        <select
          {...register("priority", { required: true })}
          className="input-field"
        >
          <option value="">Select priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.priority && (
          <span className="error-message">This field is required</span>
        )}
      </div>

      {/* Display selected tags */}
      <div className="form-group selected-tags">
        {selectedTags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="remove-tag"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      <div className="form-group">
        <label>Tags</label>
        <select className="input-field" onChange={handleTagChange}>
          <option value="">Select a tag</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
          <option value="All">All</option>
        </select>
        {!validateTags() && (
          <span className="error-message">At least one tag must be selected</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Submit
        </button>
        <button type="button" onClick={onClose} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
