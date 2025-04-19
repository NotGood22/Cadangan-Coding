"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAxios } from "@/lib/hooks/use-axios";

export const useRestoreCourseType = () => {
  const axios = useAxios();

  const queryClient = useQueryClient();

  const onRestoreCourseType = async (courseTypeId: string) => {
    try {
      const { data } = await axios.put(`/academic/course-types/trashs/${courseTypeId}`);

      queryClient.resetQueries({
        queryKey: ["get-all-course-type"],
      });

      queryClient.invalidateQueries({
        queryKey: ["get-all-trash-course-type"],
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
    mutationFn: (courseTypeId: string) => onRestoreCourseType(courseTypeId),
    mutationKey: ["restore-course-type"],
  });

  return { ...mutate };
};
