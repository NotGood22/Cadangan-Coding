"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "reactstrap";
import { usePathname } from "next/navigation";

import { useModalContext } from "@/lib/hooks/use-modal";
import { useModalConfirmationContext } from "@/lib/hooks/use-modal-confirmation";
import { useFindPermission } from "@/lib/hooks/use-find-permission";

export const useColumnTableCourseType = () => {
  const pathName = usePathname();
  const { setModalState } = useModalContext();
  const { setModalConfirmationState } = useModalConfirmationContext();

  const { updatePermission, deletePermission } = useFindPermission(pathName);

  const handleDelete = async (courseTypeId: string) => {
    setModalConfirmationState((prev) => ({
      ...prev,
      open: !prev.open,
      state: "confirm",
      message: "Hapus jenis kursus",
      id: courseTypeId,
    }));
  };

  const columns: ColumnDef<CourseType>[] = [
    {
      accessorKey: "id",
      header: () => "No",
      cell: ({ row }) => {
        return row.index + 1;
      },
    },
    {
      accessorKey: "name",
      header: "Nama Jenis Kursus",
      cell: ({ row }) => <p className="text-start">{row.original.name}</p>,
    },
    {
      accessorKey: "description",
      header: "Deskripsi Jenis Kursus",
      cell: ({ row }) => (
        <p className="text-start">{row.original.description}</p>
      ),
    },
    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }) => (
        <div className="d-flex gap-1 justify-content-center">
          {updatePermission && (
            <Button
              onClick={() => {
                setModalState((prev) => ({
                  ...prev,
                  open: !prev.open,
                  id: row.original.id,
                  state: "edit",
                }));
              }}
              className="bg-transparent border-0 text-black p-0 fs-4"
              title="Ubah"
            >
              <i className="las la-edit text-success text-lg pointer" />
            </Button>
          )}
          <Button
            onClick={() => {
              setModalState((prev) => ({
                ...prev,
                open: !prev.open,
                id: row.original.id,
                state: "detail",
              }));
            }}
            className="bg-transparent border-0 text-black p-0 fs-4"
            title="Detail"
          >
            <i className="ri-eye-line text-primary text-lg"></i>
          </Button>
          {deletePermission && (
            <Button
              className="bg-transparent border-0 text-black p-0"
              onClick={() => handleDelete(row.original.id)}
            >
              <i
                className="mdi mdi mdi-trash-can-outline fs-4 text-danger"
                title="Hapus"
              />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return { columns };
};
