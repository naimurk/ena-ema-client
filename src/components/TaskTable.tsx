"use client";
import { useState, useEffect } from "react";
import {
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useMarkAsCompletedMutation,
  useToggleReminderMutation,
  useUndoDeleteTaskMutation,
} from "@/app/redux/features/taskApi/taskApi";
import { useAppSelector } from "@/app/redux/hooks";
import { toast } from "sonner";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import { TMainT, TTask } from "@/types/taskTypes";

const TaskTable = () => {
  const isDueIn24Hours = (dueDate: string) => {
    const currentTime = new Date().getTime();
    const taskDueTime = new Date(dueDate).getTime();
    const timeDifference = taskDueTime - currentTime;

    // Check if the task is due in less than 24 hours (24 * 60 * 60 * 1000 milliseconds)
    return timeDifference <= 24 * 60 * 60 * 1000;
  };

  const filters = useAppSelector((state) => state.filter);

  const {
    data: tasksData,
    isLoading,
    error,

  } = useGetAllTasksQuery({ ...filters });




  // console.log({name : "query" , isSuccess})
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [signalTask, setSingelTask] = useState({});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTask] = useDeleteTaskMutation();
  const [markComplete] = useMarkAsCompletedMutation();
  const [UndoTheTask] = useUndoDeleteTaskMutation();
  const [toggleReminder] = useToggleReminderMutation();

  const handleMarkComplete = (id: string) => {
    markComplete(id);
  };

  const handleUndoDelete = () => {
    UndoTheTask("");
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast("Event has been created", {
      action: {
        label: "Undo",
        onClick: () => handleUndoDelete(),
      },
    });
  };

  const handleToggleReminder = (id: string, reminder: boolean) => {
    toggleReminder({ id: id, reminder: reminder ? false : true });
  };

  const handleEdit = (task: TTask) => {
    setIsEditModalOpen(true);
    setSingelTask(task);
  };

  useEffect(() => {
    if (tasksData) {
      const initialExpandedState: Record<string, boolean> = {};
      tasksData.forEach((category: TMainT) => {
        initialExpandedState[category._id] = true; // Set all categories as expanded
      });
      setExpandedCategories(initialExpandedState);
    }
  }, [tasksData]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId], // Toggle the current category's expanded state
    }));
  };
  // console.log(expandedCategories);

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error fetching tasks.</p>;

  return (
    <div className="custom-task-table">
  {tasksData?.map((category: TMainT) => (
    <div key={category._id} className="custom-category">
      <h2
        onClick={() => toggleCategory(category._id)}
        className="custom-category-header"
      >
        {category._id} ({category.count} tasks)
        <span
          className={`custom-arrow ${expandedCategories[category._id] ? "custom-rotate" : ""}`}
        >
          ▼
        </span>
      </h2>
      {expandedCategories[category._id] && (
        <table className="custom-table">
          <thead>
            <tr className="custom-table-header">
              <th className="custom-table-cell">Task Name</th>
              <th className="custom-table-cell">Description</th>
              <th className="custom-table-cell">Due Date</th>
              <th className="custom-table-cell">Priority</th>
              <th className="custom-table-cell">Status</th>
              <th className="custom-table-cell">Tags</th>
              <th className="custom-table-cell">Reminder</th>
              <th className="custom-table-cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {category?.tasks?.map((task) => (
              <tr key={task._id} className="custom-table-row">
                <td className="custom-table-cell">{task.name}</td>
                <td className="custom-table-cell">{task.description}</td>
                <td className={`custom-table-cell ${task.reminder && isDueIn24Hours(task.dueDate) ? "custom-warning" : ""}`}>
                  {task.dueDate}
                </td>
                <td className={`custom-table-cell ${task.priority === "Low" ? "custom-low" : task.priority === "Medium" ? "custom-medium" : "custom-high"}`}>
                  {task.priority}
                </td>
                <td className={`custom-table-cell ${task.completed ? "custom-completed" : ""}`}>
                  {task.completed ? "Completed" : "Pending"}
                </td>
                <td className="custom-table-cell">{task.tags}</td>
                <td className="custom-table-cell">
                  <button
                    onClick={() => handleToggleReminder(task._id, task?.reminder)}
                    className={`custom-button ${task.reminder ? "custom-button-active" : "custom-button-inactive"}`}
                  >
                    {task.reminder ? "Reminder Off" : "Set Reminder"}
                  </button>
                </td>
                <td className="custom-table-cell custom-action-cell">
                  <button
                    onClick={() => handleEdit(task)}
                    className="custom-button custom-button-edit"
                  >
                    Edit
                  </button>
                  <button
                    disabled={task.completed}
                    onClick={() => handleMarkComplete(task._id)}
                    className={`custom-button custom-button-complete ${task.completed ? "custom-button-disabled" : ""}`}
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="custom-button custom-button-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  ))}
  <Modal
    title="Edit Task"
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
  >
    <TaskForm
      task={signalTask as TTask}
      onClose={() => setIsEditModalOpen(false)}
    />
  </Modal>
</div>

  );
};

export default TaskTable;
