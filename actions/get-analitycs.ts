import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
    course: Course;
}

const groupeByCourse = (purchases: PurchaseWithCourse[]) => {
    const grouped: { [courseTitle: string]: number} = {};

    purchases.forEach((purchase) => {
        const courseTitle = purchase.course.title;
        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += purchase.course.price!;
    });

    return grouped;
};

export const getAnalitycs = async (userId: string) => {
    try {
        const purchases = await db.purchase.findMany({
            
            include: {
                course: true,
            }
        });

        const groupedEarnings = groupeByCourse(purchases);
        const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total,
        }));

        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalSales = purchases.length;

        return {
            data,
            totalRevenue,
            totalSales,
            purchases
        }
    } catch (error) {
        console.log("[GET_ANALYTICS]", error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0,
        }
    }
}