"use client";
// belum
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "reactstrap";
import { usePathname } from "next/navigation";

import { useModalConfirmationContext } from "@/lib/hooks/use-modal-confirmation";
import { useRestoreCourseType } from "@/services/api/academic/course-type/restore-course-type";
import { useFindPermission } from "@/lib/hooks/use-find-permission";

export const useColumnTableTrashCourseType = () => {
  const pathName = usePathname();
  const { setModalConfirmationState } = useModalConfirmationContext();

  const { mutateAsync, isPending: isLoadingRestoreCourseType } = useRestoreCourseType();

  const { restorePermission } = useFindPermission(pathName);

  const handleRestoreCourseType = async (courseTypeId: string) => {
    await mutateAsync(courseTypeId);
    setModalConfirmationState((prev) => ({
      ...prev,
      open: !prev.open,
      message: "Berhasil restore jenis kursus",
      state: "success",
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
        <div className="d-flex justify-content-center">
          {restorePermission && (
            <Button
              className="bg-transparent border-0 text-black p-0 me-1"
              title="Restore"
              onClick={async () => await handleRestoreCourseType(row.original.id)}
              disabled={isLoadingRestoreCourseType}
              key={row.original.id}
            >
              <i className="mdi mdi-backup-restore fs-4 text-secondary" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return { columns };
};
