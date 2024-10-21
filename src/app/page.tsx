"use client";
import Filters from "@/components/Filters";
import Modal from "@/components/Modal";
import TaskForm from "@/components/TaskForm";
import TaskTable from "@/components/TaskTable";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
          Task Management
        </h1>
        <button
          className="bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-600 transition duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          Add Task
        </button>
      </div>

      {/* Filters Section */}
      <Filters />

      {/* Task Table Section */}
      <div className="mt-6">
        <TaskTable />
      </div>

      {/* Modal for Task Form */}
      
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <TaskForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      
    </div>
  );
}
