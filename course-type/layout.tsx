import BreadCrumb from "@/components/ui/Breadcrumb";

export function generateMetadata() {
  return { title: "Jenis Kursus" };
}

export default function CourseTypeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <BreadCrumb title="Jenis Kursus" pageTitle="Academic" />
      {children}
    </div>
  );
}
