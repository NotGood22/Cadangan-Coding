"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAxios } from "@/lib/hooks/use-axios";

export const useDeleteCourseType = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const deleteCourseType = async (courseTypeId: string) => {
    try {
      const { data } = await axios.delete(`/academic/course-types/${courseTypeId}`);

      queryClient.invalidateQueries({
        queryKey: ["get-all-course-type"],
      });

      queryClient.resetQueries({
        queryKey: ["get-all-trash-course-type"],
      });

      queryClient.resetQueries({
        queryKey: ["get-detail-course-type", courseTypeId],
      });

      queryClient.resetQueries({
        queryKey: ["get-search-course-type"],
      });

      return data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const mutate = useMutation({
    mutationKey: ["delete-course-type"],
    mutationFn: (courseTypeId: string) => deleteCourseType(courseTypeId),
  });

  return { ...mutate };
};
