import { Skeleton } from "@/components/ui/skeleton";

// MonthYearLoading for the month and year component on the overview page
export function MonthYearLoading() {
  return (
    <div className="flex justify-end w-2/6 -mt-20">
      <Skeleton className="h-[20px] rounded-xl mt-4" />
      <div className="flex flex-col w-full">
        <Skeleton className="h-[70px] rounded-xl mt-4" />
      </div>
    </div>
  );
}

// MonthYearLoading for the month and year component on the overview page
export function TotalSpentLoading() {
  return (
    <div className="flex justify-end w-3/6 -mt-2">
      <div className="flex flex-col w-full">
        <Skeleton className="h-[40px] rounded-xl" />
      </div>
    </div>
  );
}

// MonthlyChartLoading for the first big chart on the overview page
export function MonthlyChartLoading() {
  return (
    <div className="flex flex-col space-y-3 items-center justify-center w-full pt-2">
      <Skeleton className="h-[40px] w-full md:w-[90%] lg:w-[30%] rounded-xl mb-8 ml-8" />
      <Skeleton className="h-[450px] w-full md:w-[90%] lg:w-[90%] rounded-xl" />
    </div>
  );
}

// MonthlyChartLoading for the first big chart on the overview page
export function BalanceMonthlyChartLoading() {
  return (
    <div className="flex flex-col space-y-3 items-center justify-center w-full pt-2">
      <Skeleton className="h-[40px] w-full md:w-[90%] lg:w-[22%] rounded-xl mb-8 mt-2 ml-8" />
      <Skeleton className="h-[450px] w-full md:w-[90%] lg:w-[90%] rounded-xl" />
    </div>
  );
}

// ChartLoading for the other charts on the overview page
export function ChartLoading() {
  return (
    <div className="pt-20 flex w-full justify-center items-center">
      <div className="w-5/12 flex justify-center items-center mx-20 p-12 border-2 border-white glow rounded-lg bg-gray-950">
        <div className="space-y-3 w-full">
          <div className="flex justify-center">
            <Skeleton className="h-[30px] w-[50%] rounded-xl" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>

      <div className="w-5/12 flex justify-center items-center mx-20 p-12 border-2 border-white glow rounded-lg bg-gray-950">
        <div className="space-y-3 w-full">
          <div className="flex justify-center">
            <Skeleton className="h-[30px] w-[50%] rounded-xl" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// TableLoading for the transactions page
export function TableLoading() {
  return (
    <div className="flex flex-col space-y-3">
      {/* Use percentages or other relative units for responsiveness */}
      <div className="flex justify-end">
        <Skeleton className="h-[90px] w-full md:w-[90%] lg:w-[32%] rounded-xl -mt-28" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-[40px] w-full md:w-[90%] lg:w-[19%] rounded-xl" />
        <Skeleton className="h-[40px] w-full md:w-[90%] lg:w-[9%] rounded-xl" />
      </div>
      <Skeleton className="h-[600px] w-full md:w-[90%] lg:w-[100%] rounded-xl" />
      <div className="space-y-2">
        {/* Adjust width with percentages or vw (viewport width) for responsiveness */}
        <Skeleton className="h-4 w-3/4 md:w-[250px]" />
        <Skeleton className="h-4 w-2/3 md:w-[200px]" />
      </div>
    </div>
  );
}

// BalanceLoading for the balance page
export function BalanceLoading() {
  return (
    <div className="mt-12">
      <div className="flex justify-center mt-8 mb-8">
        <Skeleton className="h-[170px] md:w-[90%] lg:w-[30%] rounded-xl" />
      </div>
      <div className="flex justify-center">
        <div className="lg:w-[50%] pl-4 pr-4">
          <Skeleton className="h-[1000px] rounded-xl" />
        </div>
        <div className="lg:w-[50%] pl-4 pr-4">
          <Skeleton className="h-[1000px]  rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// BalanceLoading for the balance page
export function BalanceMonthYearLoading() {
  return (
    <div className="flex justify-center w-2/6 mt-4 mb-5">
      <Skeleton className="h-[70px] w-full md:w-[90%] lg:w-[90%] rounded-xl" />
    </div>
  );
}

// components/Loading.js
export function GetDataLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-white"></div>
        <p className="text-white text-xl font-semibold">Loading...</p>
      </div>
    </div>
  );
}
