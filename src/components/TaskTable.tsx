/* eslint-disable react-hooks/exhaustive-deps */
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

  // console.log(isSuccess)

  // console.log({name : "query" , isSuccess})
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [signalTask, setSingelTask] = useState({});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [
    deleteTask,
    {
      // isSuccess: dIsSuccess,
      // isLoading: dIsLoading,
      isError: dIsError,
      error: dError,
    },
  ] = useDeleteTaskMutation();
  const [
    markComplete,
    {
      isSuccess: mcIsSuccess,
      isLoading: mcIsLoading,
      isError: mcIsError,
      error: mcError,
    },
  ] = useMarkAsCompletedMutation();
  const [
    undoTask,
    {
      isSuccess: uIsSuccess,
      isLoading: uIsLoading,
      isError: uIsError,
      error: uError,
    },
  ] = useUndoDeleteTaskMutation();
  const [
    toggleReminder,
    {
      isSuccess: trIsSuccess,
      isLoading: trIsLoading,
      isError: trIsError,
      error: trError,
    },
  ] = useToggleReminderMutation();

  // Effect for deleteTask
  useEffect(() => {
    if (dIsError) {
      const err = dError as { message: string };

      toast.error(
        `Error deleting task: ${err?.message || "Something went wrong."}`,
        { id: 1 }
      );
    }
  }, [dIsError, dError]);

  // Effect for markComplete
  useEffect(() => {
    if (mcIsLoading) {
      toast.loading("Marking task as complete...", { id: 1 });
    } else if (mcIsSuccess) {
      toast.success("Task marked as complete!", { id: 1 });
    } else if (mcIsError) {
      const err = mcError as { message: string };

      toast.error(
        `Error marking task as complete: ${
          err?.message || "Something went wrong."
        }`,
        { id: 1 }
      );
    }
  }, [mcIsLoading, mcIsSuccess, mcIsError, mcError]);

  // Effect for undoTask
  useEffect(() => {
    if (uIsLoading) {
      toast.loading("Undoing task deletion...", { id: 1 });
    } else if (uIsSuccess) {
      toast.success("Task deletion undone!", { id: 1 });
    } else if (uIsError) {
      const err = uError as { message: string };

      toast.error(
        `Error undoing task deletion: ${
          err?.message || "Something went wrong."
        }`,
        { id: 1 }
      );
    }
  }, [uIsLoading, uIsSuccess, uIsError, uError]);

  // Effect for toggleReminder
  useEffect(() => {
    if (trIsLoading) {
      toast.loading("Toggling reminder...", { id: 1 });
    } else if (trIsSuccess) {
      toast.success("Reminder toggled!", { id: 1 });
    } else if (trIsError) {
      const err = trError as { message: string };
      toast.error(
        `Error toggling reminder: ${err?.message || "Something went wrong."}`,
        { id: 1 }
      );
    }
  }, [trIsLoading, trIsSuccess, trIsError, trError]);

  const handleMarkComplete = (id: string) => {
    markComplete(id);
  };

  const handleUndoDelete = () => {
    undoTask("");
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

  //  console.log(isSuccess)

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
              className={`custom-arrow ${
                expandedCategories[category._id] ? "custom-rotate" : ""
              }`}
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
                    <td
                      className={`custom-table-cell ${
                        task.reminder && isDueIn24Hours(task.dueDate)
                          ? "custom-warning"
                          : ""
                      }`}
                    >
                      {task.dueDate}
                    </td>
                    <td
                      className={`custom-table-cell ${
                        task.priority === "Low"
                          ? "custom-low"
                          : task.priority === "Medium"
                          ? "custom-medium"
                          : "custom-high"
                      }`}
                    >
                      {task.priority}
                    </td>
                    <td
                      className={`custom-table-cell ${
                        task.completed ? "custom-completed" : ""
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </td>
                    <td className="custom-table-cell">{task.tags}</td>
                    <td className="custom-table-cell">
                      <button
                        onClick={() =>
                          handleToggleReminder(task._id, task?.reminder)
                        }
                        className={`custom-button ${
                          task.reminder
                            ? "custom-button-active"
                            : "custom-button-inactive"
                        }`}
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
                        className={`custom-button custom-button-complete ${
                          task.completed ? "custom-button-disabled" : ""
                        }`}
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
