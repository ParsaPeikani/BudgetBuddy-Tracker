import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useCIBCTransactions } from "@/components/serverFunctions/apiCalls";

export function CreditBalances() {
  const { cibcCreditBalance, cibcDebitBalance } = useCIBCTransactions();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-4">
          See Balances
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-white">
            CIBC Debit & Credit Card Balances
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            These Are Your Current Balances
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full">
          <div className="w-1/2 p-4 border-r border-gray-600">
            <div className="text-center">
              <span className="text-base text-white">Credit Card</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-lg font-semibold text-white">
                ${cibcCreditBalance}
              </span>
            </div>
          </div>
          <div className="w-1/2 p-4">
            <div className="text-center">
              <span className="text-base text-white">Debit Card</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-lg font-semibold text-white">
                ${cibcDebitBalance}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
