"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAxios } from "@/lib/hooks/use-axios";

export const useCreateCourseType = () => {
  const axios = useAxios();

  const queryClient = useQueryClient();

  const onCreateCourseType = async (form: CourseTypeForm) => {
    try {
      const reqBody = {
        ...form,
      };

      const { data } = await axios.post("/academic/course-types", reqBody);

      queryClient.invalidateQueries({
        queryKey: ["get-all-course-type"],
      });

      queryClient.resetQueries({
        queryKey: ["get-all-trash-course-type"],
      });

      queryClient.resetQueries({
        queryKey: ["get-search-course-type"],
      });

      return data;
    } catch (error: any) {
      if (error?.response?.data?.message?.name) {
        throw new Error(error?.response?.data?.message?.name);
      } else if (error?.response?.data?.message?.description) {
        throw new Error(error?.response?.data?.message?.description);
      } else {
        throw new Error(
          error?.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  const mutate = useMutation({
    mutationFn: onCreateCourseType,
    mutationKey: ["create-course-type"],
  });

  return { ...mutate };
};
