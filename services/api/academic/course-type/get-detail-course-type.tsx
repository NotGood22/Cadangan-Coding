"use client";

import { useQuery } from "@tanstack/react-query";

import { useAxios } from "@/lib/hooks/use-axios";

export const useGetDetailCourseType = (courseTypeId: string) => {
  const axios = useAxios();

  const fetchDetailCourseGroup = async (): Promise<
    ApiResponse<CourseType> | undefined
  > => {
    try {
      const { data } = await axios.get(`/academic/course-types/${courseTypeId}`);

      return data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const query = useQuery({
    queryKey: ["get-detail-course-type", courseTypeId],
    queryFn: fetchDetailCourseGroup,
    enabled: false,
  });

  return { ...query };
};
