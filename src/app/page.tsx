"use client";
import Filters from "@/components/Filters";
import Modal from "@/components/Modal";
import TaskForm from "@/components/TaskForm";
import TaskTable from "@/components/TaskTable";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container relative">
      <div className="header">
        <h1>Task Management</h1>
        <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
          Add Task
        </button>
      </div>
      <Filters />
      <TaskTable />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <TaskForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
