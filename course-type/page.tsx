"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

import DataTables from "@/components/ui/DataTables";
import { useModalContext } from "@/lib/hooks/use-modal";
import { ModalDeleteConfirmation } from "@/components/ui/ModalDeleteConfirmation";
import { useModalConfirmationContext } from "@/lib/hooks/use-modal-confirmation";
import { ACCEPTED_IMPORT_FILE } from "@/lib/constants/accepted-import-file";
import { useGetAllCourseType } from "@/services/api/academic/course-type/get-all-course-type";
import { useDeleteCourseType } from "@/services/api/academic/course-type/delete-course-type";
import { useExportCourseType } from "@/services/api/academic/course-type/export-course-type";
import { useImportCourseType } from "@/services/api/academic/course-type/import-course-type";
import { useColumnTableCourseType } from "./components/ColumnDefinitionCourseType";
import { ModalCourseType } from "./components/ModalCourseType";
import { ModalSuccessConfirmation } from "@/components/ui/ModalSuccessConfirmation";
import { useFindPermission } from "@/lib/hooks/use-find-permission";

export default function CourseTypePage() {
  const [queryParams, setQueryParams] = useState<QueryParam>({
    page: 1,
    filter: null,
    page_size: null,
    sort_by: null,
    sort_direction: null,
  });

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const pathName = usePathname();

  const { setModalState } = useModalContext();

  const { modalConfirmationState, setModalConfirmationState } =
    useModalConfirmationContext();

  const {
    writePermission,
    importPermission,
    exportPermission,
    trashPermission,
  } = useFindPermission(pathName);

  const { data: dataCourseType, isLoading: isLoadingCourseType } =
    useGetAllCourseType(queryParams);

  const {
    mutateAsync: handleDeleteCourseType,
    isPending: isLoadingDeleteCourseType,
    isSuccess: isSuccessDeleteCourseType,
  } = useDeleteCourseType();

  const { refetch: refetchExport, isFetching: isLoadingExport } =
    useExportCourseType();

  const {
    mutateAsync: handleImportCourseType,
    isPending: isloadingImportCourseType,
    isSuccess: isSuccessImportCourseType,
    isError: isErrorImportCourseType,
  } = useImportCourseType();

  const { columns } = useColumnTableCourseType();

  const handleToogleModal = (state: "add" | "edit" | "detail", id?: string) => {
    setModalState((prev) => ({
      ...prev,
      open: !prev.open,
      state,
      id,
    }));
  };

  const setPage = (value: number) => {
    setQueryParams((prev) => ({ ...prev, page: value + 1 }));
  };

  const handleSearch = useDebouncedCallback((value) => {
    setQueryParams((prev) => ({ ...prev, filter: value, page: 1 }));
  }, 1000);

  const handleExport = async () => {
    await refetchExport();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // check is file exist?
    if (event.target.files) {
      // check if type is not excel
      if (!ACCEPTED_IMPORT_FILE.includes(event?.target?.files[0].type)) {
        toast.error("File harus excel");
        // clear input file import
        if (inputFileRef.current) {
          inputFileRef.current.value = "";
        }
        return;
      }
      // import data
      const file_import = event.target.files[0];

      await handleImportCourseType(file_import);
    }
  };

  useEffect(() => {
    if (isSuccessDeleteCourseType) {
      setModalConfirmationState((prev) => ({
        ...prev,
        open: false,
      }));
      setModalConfirmationState((prev) => ({
        ...prev,
        open: !prev.open,
        state: "success",
        message: "Berhasil hapus jenis kursus",
      }));
    }

    // set page when total pages less then query param page
    if (
      (dataCourseType?.data?.metadata?.total_pages as number) < queryParams.page
    ) {
      setQueryParams((prev) => ({
        ...prev,
        page: dataCourseType?.data?.metadata?.total_pages as number,
      }));
    }
  }, [isSuccessDeleteCourseType, dataCourseType?.data?.metadata?.total_pages]);

  useEffect(() => {
    if (isSuccessImportCourseType) {
      setModalConfirmationState((prev) => ({
        ...prev,
        open: !prev.open,
        state: "success",
        message: "Berhasil import jenis kursus",
      }));
    }

    if (isSuccessImportCourseType && inputFileRef?.current?.value) {
      inputFileRef.current.value = "";
      inputFileRef.current.type = "file";
    }
  }, [isSuccessImportCourseType, inputFileRef]);

  useEffect(() => {
    if (isErrorImportCourseType && inputFileRef.current) {
      inputFileRef.current.value = "";
      inputFileRef.current.type = "file";
    }
  }, [isErrorImportCourseType]);

  return (
    <Row>
      <Col>
        <ModalCourseType />
        <ModalDeleteConfirmation
          isLoading={isLoadingDeleteCourseType}
          onDelete={async () =>
            await handleDeleteCourseType(modalConfirmationState.id as string)
          }
        />
        <ModalSuccessConfirmation />
        <Card className="p-0">
          <CardHeader>
            <Row className="gap-2">
              <Col className="d-flex gap-2 flex-wrap" sm={12} lg={6}>
                {writePermission && (
                  <Button
                    type="button"
                    color="success"
                    className="btn create-btn"
                    onClick={() => handleToogleModal("add")}
                    title={"Tambah"}
                  >
                    <i className="ri-add-line align-bottom me-1" /> Jenis Kursus
                  </Button>
                )}
                {exportPermission && (
                  <Button
                    type="button"
                    onClick={handleExport}
                    disabled={isLoadingExport}
                    color="primary"
                    className="btn btn-primary create-btn"
                    style={{ width: "105px" }}
                  >
                    {isLoadingExport ? (
                      <Spinner size={"sm"} />
                    ) : (
                      <>
                        <i className="bx bxs-file-export align-center me-1 fs-5" />
                        Export
                      </>
                    )}
                  </Button>
                )}
                {importPermission && (
                  <div>
                    <input
                      ref={inputFileRef}
                      type="file"
                      onChange={handleImport}
                      style={{ display: "none" }}
                      name="fImport"
                      id="Fimport"
                      accept=".xlsx, .xls"
                    />
                    <Button
                      type="button"
                      color="primary"
                      disabled={isloadingImportCourseType}
                      className="btn create-btn d-flex align-items-center p-0"
                      style={{ width: "100px" }}
                    >
                      <Label
                        htmlFor="Fimport"
                        className="py-2 px-3 m-0 pointer mx-auto"
                        style={{ cursor: "pointer" }}
                      >
                        {isloadingImportCourseType ? (
                          <Spinner size={"sm"} />
                        ) : (
                          <>
                            <i className="bx bxs-file-import align-center me-1 fs-5" />
                            Import
                          </>
                        )}
                      </Label>
                    </Button>
                  </div>
                )}
                {trashPermission && (
                  <Link
                    href="/academic/course-type/trash"
                    className="text-decoration-none text-white"
                  >
                    <Button
                      type="button"
                      color="danger"
                      style={{ width: "90px" }}
                    >
                      <i className="las la-trash-restore align-center me-1"></i>{" "}
                      Trash
                    </Button>
                  </Link>
                )}
              </Col>
              <Col className="d-flex gap-2 ms-auto" sm={12} lg={2}>
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
                data={dataCourseType?.data}
                pageCount={dataCourseType?.data.metadata.total_pages as number}
                pagination={queryParams}
                setPagination={setPage}
                isLoading={isLoadingCourseType}
                total={dataCourseType?.data.metadata.total as number}
              />
            </Col>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
