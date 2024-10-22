"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { resetFilter, setFilter } from "@/app/redux/slice/filterSlice";

const Filters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filter);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    dispatch(setFilter({ [name]: value }));
  };

  const handleReset = () => {
    dispatch(resetFilter());
  };
  // console.log(filters);

  return (
    <div className="filter-container">
  <form className="filter-form">
    <input
      type="text"
      name="search"
      placeholder="Search by keyword"
      value={filters.search}
      onChange={handleChange}
      className="input-field"
    />
    <select
      name="completed"
      value={filters.completed}
      onChange={handleChange}
      className="select-field"
    >
      <option value="">Select Status</option>
      <option value={"true"}>Completed</option>
      <option value={"false"}>Pending</option>
    </select>
    <select
      name="priority"
      value={filters.priority}
      onChange={handleChange}
      className="select-field"
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
      className="select-field"
    >
      <option value="">Select Tags</option>
      <option value="All">All</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Shopping">Shopping</option>
    </select>
    <div className="button-container">
      <button
        type="button"
        onClick={handleReset}
        className="reset-button"
      >
        Reset
      </button>
    </div>
  </form>
</div>

  );
};

export default Filters;
