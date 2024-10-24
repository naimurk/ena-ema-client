export type TQueryParams = {
  name: string;
  value: boolean | React.Key;
};

import { baseApi } from "../../api/baseApi"; // assuming baseApi is pre-configured

const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tasks with optional filtering
    getAllTasks: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        for (const key in params) {
          const element = params[key];
          searchParams.append(key, element as string);
        }

        return {
          url: "/tasks", // Correct API route
          method: "GET",
          params: searchParams,
        };
      },
      providesTags: ["tasks"],
    }),
    getSingleTask: builder.query({
      query: ({ id }) => {
        return {
          url: `/tasks/${id}`, // Correct API route
          method: "GET",
          // params: searchParams,
        };
      },
      providesTags: ["tasks"],
    }),
    // Create a task
    createTask: builder.mutation({
      query: (data) => {
        return {
          url: "/tasks", // Correct API route
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["tasks"],
      // transformResponse : (res) => res
    }),

    // Undo deleted task
    undoDeleteTask: builder.mutation({
      query: () => {
        return {
          url: "/tasks/undo", // Correct API route
          method: "POST",
        };
      },
      invalidatesTags: ["tasks"],
    }),

    // Update a task
    updateTask: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/tasks/${id}`, // Correct API route
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["tasks"],
    }),

    // Mark a task as complete
    markAsCompleted: builder.mutation({
      query: (id) => {
        return {
          url: `/tasks/${id}/complete`, // Correct API route
          method: "PATCH",
        };
      },
      invalidatesTags: ["tasks"],
    }),

    // Toggle reminder for a task
    toggleReminder: builder.mutation({
      query: ({ id, reminder }) => {
        return {
          url: `/tasks/${id}/reminder`, // Correct API route
          method: "PATCH",
          body: { reminder }, // sending reminder status in body
        };
      },
      invalidatesTags: ["tasks"],
    }),

    // Delete a task
    deleteTask: builder.mutation({
      query: (id) => {
        return {
          url: `/tasks/${id}`, // Correct API route
          method: "DELETE",
        };
      },
      invalidatesTags: ["tasks"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useUndoDeleteTaskMutation,
  useUpdateTaskMutation,
  useMarkAsCompletedMutation,
  useToggleReminderMutation,
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useGetSingleTaskQuery,
} = taskApi;
