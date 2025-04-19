"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAxios } from "@/lib/hooks/use-axios";

export const useImportCourseType = () => {
  const axios = useAxios();

  const queryClient = useQueryClient();

  const onImportCourseType = async (form: any) => {
    const formData = new FormData();

    formData.append("file_import", form);
    try {
      const { data } = await axios.post("/academic/course-types/import", formData);

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
      throw new Error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const query = useMutation({
    mutationKey: ["import-course-type"],
    mutationFn: onImportCourseType,
  });

  return { ...query };
};
