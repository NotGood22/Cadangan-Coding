"use client";

import { useQuery } from "@tanstack/react-query";

import { useAxios } from "@/lib/hooks/use-axios";

export const useGetAllCourseType = (queryParam: QueryParam) => {
  const axios = useAxios();

  let params: QueryParam = {
    page: queryParam.page,
    page_size: queryParam.page_size,
    sort_by: queryParam.sort_by,
    sort_direction: queryParam.sort_direction,
  };

  if (queryParam.filter) {
    params = {
      ...params,
      filter: queryParam.filter,
    };
  }

  const fetchCourseTypes = async (): Promise<
    ApiResponse<PaginationData<CourseType>> | undefined
  > => {
    try {
      const { data } = await axios.get("/academic/course-types", { params });

      return data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const query = useQuery({
    queryKey: [
      "get-all-course-type",
      params.page,
      params.filter,
      params.page_size,
      params.sort_by,
      params.sort_direction,
    ],
    queryFn: fetchCourseTypes,
  });

  return { ...query };
};
