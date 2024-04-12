import { Skeleton } from "@/components/ui/skeleton";

export function TableLoading() {
  return (
    <div className="flex flex-col space-y-3">
      {/* Use percentages or other relative units for responsiveness */}
      <Skeleton className="h-[400px] w-full md:w-[90%] lg:w-[95%] rounded-xl" />
      <div className="space-y-2">
        {/* Adjust width with percentages or vw (viewport width) for responsiveness */}
        <Skeleton className="h-4 w-3/4 md:w-[250px]" />
        <Skeleton className="h-4 w-2/3 md:w-[200px]" />
      </div>
    </div>
  );
}

export function ChartLoading() {
  return (
    <div className="pt-20 flex w-full justify-center items-center">
      <div className="w-5/12 flex justify-center items-center mx-20">
        <div className="space-y-3 w-full">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>

      <div className="w-5/12 flex justify-center items-center mx-20">
        <div className="space-y-3 w-full">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
