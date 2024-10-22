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
  console.log(expandedCategories);

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error fetching tasks.</p>;

  return (
    <div className="task-table p-6 bg-white rounded-lg shadow-md overflow-x-auto">
      {tasksData?.map((category: TMainT) => (
        <div key={category._id} className="mb-8">
          <h2
            onClick={() => toggleCategory(category._id)}
            className="cursor-pointer text-2xl font-semibold text-gray-800 mb-4 flex justify-between items-center"
          >
            {category._id} ({category.count} tasks)
            <span
              className={`ml-2 transition-transform duration-300 ${
                expandedCategories[category._id] ? "transform rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </h2>
          {expandedCategories[category._id] && (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Task Name
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Due Date
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Priority
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Tags
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Reminder
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {category?.tasks?.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-100 transition duration-150 ease-in-out"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {task.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {task.description}
                    </td>
                    <td
                      className={`border px-4 py-2 border-gray-300 ${
                        task.reminder && isDueIn24Hours(task.dueDate)
                          ? "text-yellow-500 animate-pulse font-bold"
                          : ""
                      }`}
                    >
                      {task.dueDate}
                    </td>
                    <td
                      className={`border border-gray-300 font-medium px-4 py-2 ${
                        task.priority === "Low"
                          ? "text-green-500"
                          : task.priority === "Medium"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {task.priority}
                    </td>

                    <td
                      className={`border border-gray-300 px-4 py-2 ${
                        task.completed ? " text-gray-400" : ""
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {task.tags}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() =>
                          handleToggleReminder(task._id, task?.reminder)
                        }
                        className={`px-2 py-1 rounded ${
                          task.reminder
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        } transition duration-150 ease-in-out`}
                      >
                        {task.reminder ? "Reminder Off" : "Set Reminder"}
                      </button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150"
                      >
                        Edit
                      </button>
                      <button
                        disabled={task.completed}
                        onClick={() => handleMarkComplete(task._id)}
                        className={`px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-150 disabled:bg-green-200 disabled:cursor-not-allowed`}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-150"
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
