import { redirect } from "next/navigation";

import { getAnalitycs } from "@/actions/get-analitycs";
import { auth, clerkClient } from "@clerk/nextjs";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { db } from "@/lib/db";





const AnalyticsPage = async () => {
    const users = await clerkClient.users.getUserList();

    const { userId } = auth();
    
    if (!userId) {
        return redirect("/");
    }

    const {
        data,
        totalRevenue,
        totalSales,
        purchases
    } = await getAnalitycs(userId);

    const simplifiedUsers = users.map(user => ({
        id: user.id,
        createdAt: user.createdAt,
        imageUrl: user.imageUrl,
        emailAddresses: user.emailAddresses[0].emailAddress,
        phoneNumbers: user.phoneNumbers[0]?.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        lastSignInAt: user.lastSignInAt,
        purchasedCourses: purchases?.filter(item => item.userId === user.id).map(item => item.course.title).join() || null
      }));
    console.log(simplifiedUsers);

    return ( 

        <div className="p-6">
            {/*
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DataCard
                    label="Загальний прибуток" 
                    value={totalRevenue}
                    shouldFormat
                />

                <DataCard
                    label="Загальні продажі" 
                    value={totalSales}
                />
                
            </div>

            <Chart
                data={data}
            />
            */}
           <DataTable columns={columns} data={simplifiedUsers} />
        </div>
     );
}
 
export default AnalyticsPage;