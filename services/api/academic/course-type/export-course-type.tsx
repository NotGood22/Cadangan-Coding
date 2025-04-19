"use client";

import { useAxios } from "@/lib/hooks/use-axios";
import { useQuery } from "@tanstack/react-query";
import FileSaver from "file-saver";

export const useExportCourseType = () => {
  const axios = useAxios();

  const exportCourseType = async () => {
    try {
      const { data } = await axios.get("/academic/course-types/export", {
        responseType: "blob",
      });

      FileSaver.saveAs(data, "course-type.xlsx");

      return data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const query = useQuery({
    queryKey: ["export-course-type"],
    queryFn: exportCourseType,
    enabled: false,
  });

  return { ...query };
};
