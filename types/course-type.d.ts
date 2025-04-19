interface CourseType {
  id: string;
  name: string;
  description: string;
  created_at: number;
  updated_at: number;
}

type CourseTypeForm = Pick<CourseType, "name" | "description">;
