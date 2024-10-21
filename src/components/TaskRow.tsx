"use client";
import { useState } from "react";
import {
  useDeleteTaskMutation,
  useMarkAsCompletedMutation,
} from "@/app/redux/features/taskApi/taskApi";
import { useAppDispatch } from "@/app/redux/hooks";
import TaskForm from "./TaskForm";
import Modal from "./Modal";

const TaskRow = ({ task }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTask] = useDeleteTaskMutation();
  const [markComplete] = useMarkAsCompletedMutation();

  const handleDelete = () => {
    deleteTask(task._id);
  };

  const handleMarkComplete = () => {
    markComplete(task._id);
  };

  return (
    <>
      <tr className={task.isCompleted ? "completed-task" : ""}>
        <td>{task.name}</td>
        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
        <td>{task.priority}</td>
        <td>{task?.tags?.join(', ')}</td>
        <td>
          <button onClick={() => setIsEditModalOpen(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleMarkComplete}>
            {task.isCompleted ? "Undo" : "Complete"}
          </button>
        </td>
      </tr>

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <TaskForm task={task} onClose={() => setIsEditModalOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default TaskRow;
