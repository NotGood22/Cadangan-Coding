"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

import { useModalContext } from "@/lib/hooks/use-modal";
import { useModalConfirmationContext } from "@/lib/hooks/use-modal-confirmation";
import { classMerge } from "@/lib/utils/class-merge";
import { useCreateCourseType } from "@/services/api/academic/course-type/create-course-type";
import { useUpdateCourseType } from "@/services/api/academic/course-type/update-course-type";
import { useGetDetailCourseType } from "@/services/api/academic/course-type/get-detail-course-type";

import {
  FormCourseTypeSchema,
  FormCourseTypeType,
} from "@/lib/validations/form-course-type";

export const ModalCourseType: React.FC = () => {
  const { modalState, setModalState } = useModalContext();
  const { setModalConfirmationState } = useModalConfirmationContext();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    control,
    setValue,
    reset,
  } = useForm<FormCourseTypeType>({
    resolver: zodResolver(FormCourseTypeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync: onCreate, isSuccess: isSuccessCreate } =
    useCreateCourseType();

  const { mutateAsync: onUpdate, isSuccess: isSuccessUpdate } = useUpdateCourseType(
    modalState?.id as string
  );

  const {
    data: dataCourseType,
    isLoading: isLoadingCourseType,
    refetch: refetchCourseType,
  } = useGetDetailCourseType(modalState?.id as string);

  const handleToogleModal = () => {
    setModalState((prev) => ({
      ...prev,
      open: !prev.open,
    }));
  };

  const onSubmit = async (data: FormCourseTypeType) => {
    if (modalState.state === "add") {
      return await onCreate(data);
    } else if (modalState.state === "edit") {
      return await onUpdate(data);
    }
  };

  const handleSetForm = () => {
    setValue("description", dataCourseType?.data?.description as string);
    setValue("name", dataCourseType?.data?.name as string);
  };

  useEffect(() => {
    if (isSuccessCreate) {
      handleToogleModal();
      setModalConfirmationState((prev) => ({
        ...prev,
        open: true,
        state: "success",
        message: "Berhasil tambah jenis kursus",
      }));
    }
  }, [isSuccessCreate]);

  useEffect(() => {
    if (isSuccessUpdate) {
      handleToogleModal();
      setModalConfirmationState((prev) => ({
        ...prev,
        open: true,
        state: "success",
        message: "Berhasil ubah jenis kursus",
      }));
    }
  }, [isSuccessUpdate]);

  useEffect(() => {
    if (modalState.state === "add") {
      reset();
    } else {
      refetchCourseType();
      handleSetForm();
    }

    if (!modalState.open) {
      reset();
    }
  }, [modalState.open, modalState.id]);

  useEffect(() => {
    if (dataCourseType) {
      handleSetForm();
    }
  }, [dataCourseType]);

  return (
    <Modal isOpen={modalState.open} centered>
      <div className="d-flex justify-content-end px-2 pt-1">
        <Button className="bg-white border-0 p-0" onClick={handleToogleModal}>
          <i className=" ri-close-fill text-black fs-4"></i>
        </Button>
      </div>
      <ModalHeader className="ps-3 pt-0">
        <p className="fs-4 fw-semibold mb-0 text-black">
          {modalState.state === "detail" && "Detail Jenis Kursus"}
          {modalState.state === "edit" && "Ubah Jenis Kursus"}
          {modalState.state === "add" && "Tambah Jenis Kursus"}
        </p>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Row className="gap-2">
            <Col sm={12}>
              <Label htmlFor="name" className="form-label required mb-1">
                Nama Jenis Kursus
              </Label>
              <div className="form-icon">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      className="form-control form-control-icon"
                      id="name"
                      placeholder="Masukkan nama jenis kursus"
                      type="text"
                      invalid={!!errors.name}
                      disabled={
                        isLoadingCourseType || modalState.state === "detail"
                      }
                      {...field}
                    />
                  )}
                />
                <i className="mdi mdi-menu" />
              </div>
              {errors.name && (
                <div className="text-danger">{errors.name.message}</div>
              )}
            </Col>
            <Col sm={12}>
              <Label htmlFor="name" className="form-label required mb-1">
                Deskripsi Jenis Kursus
              </Label>
              <div className="form-icon">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      className="form-control form-control-icon"
                      id="description"
                      placeholder="Masukkan deskripsi jenis kursus"
                      type="text"
                      invalid={!!errors.description}
                      disabled={
                        isLoadingCourseType || modalState.state === "detail"
                      }
                      {...field}
                    />
                  )}
                />
                <i className="mdi mdi-menu" />
              </div>
              {errors.description && (
                <div className="text-danger">
                  {errors.description.message}
                </div>
              )}
            </Col>
          </Row>
          <div className="d-flex justify-content-end mt-3">
            <Button
              type="button"
              className={classMerge(
                modalState.state === "detail" ? "btn-success" : "btn-light",
                " waves-effect waves-light me-2"
              )}
              onClick={handleToogleModal}
              style={{ width: "80px" }}
            >
              Tutup
            </Button>
            {modalState.state !== "detail" && (
              <Button
                className="btn btn-success waves-effect waves-light"
                disabled={isSubmitting}
                style={{ width: "80px" }}
              >
                {isSubmitting ? (
                  <Spinner size={"sm"} />
                ) : modalState.state === "add" ? (
                  "Tambah"
                ) : (
                  "Ubah"
                )}
              </Button>
            )}
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
