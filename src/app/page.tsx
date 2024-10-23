"use client";
import Filters from "@/components/Filters";
import Modal from "@/components/Modal";
import TaskForm from "@/components/TaskForm";
import TaskTable from "@/components/TaskTable";
import { useState } from "react";
import { Toaster } from "sonner";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="custom-container">
    <div className="custom-flex custom-justify-between custom-items-center custom-mb-6">
      <h1 className="custom-text-xl custom-md-text-3xl custom-font-semibold custom-text-gray-800">
        Task Management
      </h1>
      <button
        className="custom-button"
        onClick={() => setIsModalOpen(true)}
      >
        Add Task
      </button>
    </div>
  
    {/* Filters Section */}
    <Filters />
  
    {/* Task Table Section */}
    <div className="custom-mt-6">
      <TaskTable />
    </div>
  
    {/* Modal for Task Form */}
    <Modal
      title="Create Task"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <TaskForm onClose={() => setIsModalOpen(false)} />
    </Modal>
    <Toaster richColors />
  </div>
  
  );
}
