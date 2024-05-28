import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
//import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

//import { Categories } from "./_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};

const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });


  const filteredCourses = courses.filter(course => course.progress !== null);

 

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        {/*
        <SearchInput />
        */}
      </div>
      <div className="p-6 space-y-4">
        {/*
        <Categories
          items={categories}
        />
        */}
        <CoursesList items={filteredCourses.length === 0 ? courses : filteredCourses} />
      </div>
    </>
   );
}
 
export default SearchPage;