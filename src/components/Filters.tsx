"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { resetFilter, setFilter } from "@/app/redux/slice/filterSlice";

const Filters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filter);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(setFilter({ [name]: value }));
  };

  const handleReset = () => {
    dispatch(resetFilter());
  };
  // console.log(filters);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <form className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 ">
        <input
          type="text"
          name="search"
          placeholder="Search by keyword"
          value={filters.search}
          onChange={handleChange}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <select
          name="completed"
          value={filters.completed}
          onChange={handleChange}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="">Select Status</option>
          <option value={"true"}>Completed</option>
          <option value={"false"}>Pending</option>
        </select>
        <select
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {/* New Tag Select Field */}
        <select
          name="tags"
          value={filters.tags}
          onChange={handleChange}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="">Select Tags</option>
          <option value="All">All</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
        </select>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-2">
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Filters;
