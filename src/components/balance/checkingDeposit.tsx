import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CheckingDeposit() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-white bg-gray-950">
          Deposit Info
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-90 bg-gray-950">
        <div className="grid gap-4 p-2">
          <div className="space-y-2 align-middle text-center">
            <h4 className="font-medium leading-none text-white text-xl">
              Direct Deposit
            </h4>
            <p className="text-sm text-gray-400">
              Provide this information to set up direct deposit
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4 text-white">
              <div className="col-span-1 text-left font-medium text-gray-400 whitespace-nowrap">
                <span>Bank Name</span>
              </div>
              <div className="col-span-2 text-right text-white">
                <span>TD Canada Trust</span>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4 text-white">
              <div className="col-span-1 text-left font-medium text-gray-400 whitespace-nowrap">
                <span>Transit Number</span>
              </div>
              <div className="col-span-2 text-right text-white">
                <span>93240</span>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4 text-white">
              <div className="col-span-1 text-left font-medium text-gray-400 whitespace-nowrap">
                <span>Institution Number</span>
              </div>
              <div className="col-span-2 text-right text-white">
                <span>004</span>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4 text-white">
              <div className="col-span-1 text-left font-medium text-gray-400 whitespace-nowrap">
                <span>Account</span>
              </div>
              <div className="col-span-2 text-right text-white">
                <span>6010936</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
