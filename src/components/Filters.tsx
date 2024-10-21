"use client"
import { useAppDispatch } from '@/app/redux/hooks';
import { useForm } from 'react-hook-form';

const Filters = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useAppDispatch();

  const onSubmit = (data) => {
    // dispatch(filterTasks(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="filters">
      <input type="text" placeholder="Search by keyword" {...register('search')} />
      <select {...register('status')}>
        <option value="All">All</option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>
      <select {...register('priority')}>
        <option value="">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button type="submit">Filter</button>
    </form>
  );
};

export default Filters;
