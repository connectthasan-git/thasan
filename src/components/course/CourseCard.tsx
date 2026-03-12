import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/helpers";
import type { Course } from "@/types/course";
import { HiOutlineClock, HiOutlineUsers, HiOutlineStar } from "react-icons/hi";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card hover className="h-full flex flex-col">
        {/* Image */}
        <div className="w-full h-44 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-white text-4xl font-bold">{course.title[0]}</span>
        </div>

        {/* Category */}
        <Badge variant="info">{course.category.replace("-", " ")}</Badge>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mt-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{course.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <HiOutlineClock size={16} /> {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineUsers size={16} /> {course.enrolledCount}
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineStar size={16} /> {course.rating}
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            {course.price === 0 ? "Free" : formatCurrency(course.price)}
          </span>
          <span className="text-sm text-gray-500">by {course.instructor}</span>
        </div>
      </Card>
    </Link>
  );
}
