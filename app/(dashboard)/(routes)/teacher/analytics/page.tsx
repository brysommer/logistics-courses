import { redirect } from "next/navigation";

import { getAnalitycs } from "@/actions/get-analitycs";
import { auth } from "@clerk/nextjs";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";


const AnalyticsPage = async () => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        data,
        totalRevenue,
        totalSales
    } = await getAnalitycs(userId);
    return ( 
        <div className="p-6">
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
        </div>
     );
}
 
export default AnalyticsPage;