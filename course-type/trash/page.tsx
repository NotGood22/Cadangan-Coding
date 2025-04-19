"use client";

import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Row,
} from "reactstrap";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import DataTables from "@/components/ui/DataTables";
import { ModalSuccessConfirmation } from "@/components/ui/ModalSuccessConfirmation";
import { useGetAllTrashCourseType } from "@/services/api/academic/course-type/get-all-trash-course-type";
import { useColumnTableTrashCourseType } from "./components/ColumnDefinitionTrashCourseType";

export default function CourseTypeTrashPage() {
  const [queryParams, setQueryParams] = useState<QueryParam>({
    page: 1,
    filter: null,
    page_size: null,
    sort_by: null,
    sort_direction: null,
  });

  const {
    data: dataTrashCourseType,
    isLoading: isLoadingTrashCourseType,
    isSuccess: isSuccessRestoreTrashCourseType,
  } = useGetAllTrashCourseType(queryParams);

  const { columns } = useColumnTableTrashCourseType();

  const handleSearch = useDebouncedCallback((value) => {
    setQueryParams((prev) => ({ ...prev, filter: value, page: 1 }));
  }, 1000);

  const setPage = (value: number) => {
    setQueryParams((prev) => ({ ...prev, page: value + 1 }));
  };

  // set page when total page less then query param page
  useEffect(() => {
    if (
      (dataTrashCourseType?.data?.metadata?.total_pages as number) <
      queryParams.page
    ) {
      setQueryParams((prev) => ({
        ...prev,
        page: dataTrashCourseType?.data?.metadata?.total_pages as number,
      }));
    }
  }, [
    isSuccessRestoreTrashCourseType,
    dataTrashCourseType?.data?.metadata?.total_pages,
  ]);

  return (
    <Row>
      <Col>
        <ModalSuccessConfirmation />
        <Card className="p-0">
          <CardHeader>
            <Row>
              <Col className="d-flex gap-2" sm={12} md={4} lg={6}>
                <Link href="/academic/course-type">
                  <Button className="border-0 bg-transparent text-black d-flex align-items-center p-0 rounded-pill">
                    <i className="mdi mdi-arrow-left-thin fs-5"></i>
                    <span className="ms-1">Kembali</span>
                  </Button>
                </Link>
              </Col>
              <Col className="d-flex gap-2 ms-auto" sm={12} md={4} lg={2}>
                <div className="form-icon w-100 ms-auto">
                  <Input
                    type="text"
                    className="form-control form-control-icon"
                    id="iconInput"
                    placeholder="Search"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <i className="ri-search-line"></i>
                </div>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Col className="table-responsive" sm={12}>
              <DataTables
                columns={columns}
                data={dataTrashCourseType?.data}
                pageCount={
                  dataTrashCourseType?.data?.metadata.total_pages as number
                }
                pagination={queryParams}
                setPagination={setPage}
                isLoading={isLoadingTrashCourseType}
                total={dataTrashCourseType?.data.metadata.total as number}
              />
            </Col>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
