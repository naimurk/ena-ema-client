"use client";
import { useState } from "react";
import { useGetAllTasksQuery } from "@/app/redux/features/taskApi/taskApi";
import TaskRow from "./TaskRow";

const TaskTable = () => {
  const { data: tasks, isLoading, error } = useGetAllTasksQuery(undefined);
  const [expandedCategories, setExpandedCategories] = useState({}); // Track the expanded state of each category

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching tasks.</p>;

  // Group tasks by their tags (categories)
  const groupByCategory = (tasks) => {
    const grouped = tasks.reduce((acc, task) => {
      task?.tags?.forEach((tag) => {
        if (!acc[tag]) {
          acc[tag] = [];
        }
        acc[tag].push(task);
      });
      return acc;
    }, {});
    return grouped;
  };

  const groupedTasks = groupByCategory(tasks);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category], // Toggle the state for the specific category
    }));
  };

  return (
    <div className="task-table">
      {Object.keys(groupedTasks).map((category) => (
        <div key={category} className="category-group">
          {/* Collapsible Category Header */}
          <div
            className="category-header"
            onClick={() => toggleCategory(category)}
            style={{ cursor: "pointer", padding: "10px", fontWeight: "bold" }}
          >
            {category} ({groupedTasks[category].length})
          </div>

          {/* Collapsible Section */}
          {expandedCategories[category] !== false && ( // Default to expanded if no state is set
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedTasks[category].map((task) => (
                  <TaskRow key={task._id} task={task} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskTable;
