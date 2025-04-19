"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAxios } from "@/lib/hooks/use-axios";

export const useUpdateCourseType = (courseTypeId: string) => {
  const axios = useAxios();

  const queryClient = useQueryClient();

  const onUpdateCourseType = async (form: CourseTypeForm) => {
    try {
      const reqBody = {
        ...form,
      };

      const { data } = await axios.put(`/academic/course-types/${courseTypeId}`, reqBody);

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
    mutationFn: onUpdateCourseType,
    mutationKey: ["update-course-type", courseTypeId],
  });

  return { ...mutate };
};
