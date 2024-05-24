import axios from "axios";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { Button } from "../ui/button";
import { useSession } from "@clerk/nextjs";
import { Checking } from "../balance/checkingTable";
import React, { createContext, useState, useContext, useCallback } from "react";
import { set } from "mongoose";
import Image from "next/image";

///////////////////////////////////TD Transactions/////////////////////////////////////

const TDTransactionsContext = createContext({
  AllTDTransactions: [] as Checking[],
  TdCheckingTransactions: [] as Checking[],
  TdSavingTransactions: [] as Checking[],
  Balances: [] as any,
  TDmonth: "",
  TDyear: "2024",
  isTdLoading: false,
  setIsTdLoading: (value: boolean) => {},
  FetchAllTDTransactions: (lastYear: boolean) => {},
  FetchTDCheckingTransactions: () => {},
  FetchTDSavingTransactions: () => {},
  FetchBalances: () => {},
  GetNewTDTransactions: (data: any) => {},
});

export const TDTransactionsProvider = ({ children }: { children: any }) => {
  const [AllTDTransactions, setAllTDTransactions] = useState<Checking[]>([]);
  const [TdCheckingTransactions, setTdCheckingTransactions] = useState<
    Checking[]
  >([]);
  const [TdSavingTransactions, setTdSavingTransactions] = useState<Checking[]>(
    []
  );
  const [TDmonth, setTDmonth] = useState("");
  const [TDyear, setTDyear] = useState("");
  const [Balances, setBalances] = useState<any>([]);
  const [isTdLoading, setIsTdLoading] = useState(true);

  const FetchAllTDTransactions = useCallback(async (lastYear: boolean) => {
    const response = await axios.get("/api/mongoDB/fetchAllTDTransactions", {
      params: { lastYear },
    });
    const TDTrans = response.data.map((transaction: any) => ({
      id: transaction.transactionId,
      accountId: transaction.accountId,
      date: new Date(transaction.date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      name: transaction.name ? transaction.name : "UnKnown",
      amount: transaction.amount,
      category: transaction.category[0],
      status: transaction.pending ? "Pending" : "Verified",
    }));
    setAllTDTransactions(TDTrans);
  }, []);

  // Fetch TD Checking Transactions from Database
  const FetchTDCheckingTransactions = useCallback(async () => {
    const response = await axios.get(
      "/api/mongoDB/fetchTDCheckingTransactions"
    );
    const TDTrans = response.data.map((transaction: any) => ({
      id: transaction.transactionId,
      date: new Date(transaction.date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      name: transaction.name ? transaction.name : "UnKnown",
      amount: transaction.amount,
      category: transaction.category[0],
      status: transaction.pending ? "Pending" : "Verified",
    }));
    setTdCheckingTransactions(TDTrans);
  }, []);

  // Fetch TD Saving Transactions from Database
  const FetchTDSavingTransactions = useCallback(async () => {
    const response = await axios.get("/api/mongoDB/fetchTDSavingTransactions");
    const TDTrans = response.data.map((transaction: any) => ({
      id: transaction.transactionId,
      date: new Date(transaction.date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      name: transaction.name ? transaction.name : "UnKnown",
      amount: transaction.amount,
      category: transaction.category[0],
      status: transaction.pending ? "Pending" : "Verified",
    }));
    setTdSavingTransactions(TDTrans);
  }, []);

  // Fetch TD Checking and Saving TD balances
  const FetchBalances = useCallback(async () => {
    try {
      const response = await axios.get("/api/mongoDB/fetchBalances");
      setBalances(response.data);
    } catch (error) {
      console.error("Failed to fetch balances:", error);
    }
  }, []);

  // Fetch new TD Transactions based on the year and month from the database
  const GetNewTDTransactions = async (data: any) => {
    // setIsLoading(true);
    try {
      await axios
        .get(
          `/api/mongoDB/newTDTransactions?year=${data.year}&month=${data.month}`
        )
        .then((newdata) => {
          const newColumns = newdata.data.map((transaction: any) => ({
            id: transaction.transactionId,
            accountId: transaction.accountId,
            date: new Date(transaction.date).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            name: transaction.name ? transaction.name : "UnKnown",
            amount: transaction.amount,
            category: transaction.category[0],
            status: transaction.pending ? "Pending" : "Verified",
          }));
          setAllTDTransactions(newColumns);
          setTDmonth(data.month);
          setTDyear(data.year);
        });
    } catch (error) {
      console.error(
        "There was an error fetching the new TD transactions!",
        error
      );
    }
  };

  return (
    <TDTransactionsContext.Provider
      value={{
        AllTDTransactions,
        TdCheckingTransactions,
        TdSavingTransactions,
        Balances,
        TDmonth,
        TDyear,
        isTdLoading,
        setIsTdLoading,
        FetchAllTDTransactions,
        FetchTDCheckingTransactions,
        FetchTDSavingTransactions,
        FetchBalances,
        GetNewTDTransactions,
      }}
    >
      {children}
    </TDTransactionsContext.Provider>
  );
};

export const useTDTransactions = () => useContext(TDTransactionsContext);

///////////////////////////////////CIBC Transactions/////////////////////////////////////

interface CIBCTransaction {
  id: string;
  date: string;
  transaction: string;
  amount: number;
  category: string;
  verified: string;
}

// Fetch CIBCTransactions from the database

const CIBCTransactionsContext = createContext({
  CIBCTransactions: [] as CIBCTransaction[],
  BalanceCIBCTransactions: [] as CIBCTransaction[],
  isLoading: false,
  month: "",
  year: "",
  totalSpent: 0,
  setTotalSpent: (value: number) => {},
  FetchCIBCTransactions: () => {},
  FetchCIBCBalances: () => {},
  setCIBCTransactions: (transactions: CIBCTransaction[]) => {},
  setBalanceCIBCTransactions: (transactions: CIBCTransaction[]) => {},
  setIsLoading: (value: boolean) => {},
  setMonth: (month: string) => {},
  setYear: (year: string) => {},
  DeleteCIBCTransaction: (transactionId: string) => {},
  DeleteCIBCTransactionFromBackend: (
    id: string,
    deletedTransaction: CIBCTransaction | undefined,
    newTransactions: CIBCTransaction[]
  ) => {},
  RestoreCIBCTransaction: (
    deletedTransaction: CIBCTransaction | undefined,
    newTransactions: CIBCTransaction[],
    originalTransaction: any
  ) => {},
  DeleteAllSelectedRows: (table: any) => {},
  DeleteMultipleCIBCTransactionsFromBackend: (
    deletedTransactions: CIBCTransaction[],
    updatedTransactions: CIBCTransaction[]
  ) => {},
  RestoreMultipleCIBCTransactions: (
    deletedTransactions: CIBCTransaction[],
    updatedTransactions: CIBCTransaction[],
    fullDeletedTransactionData: CIBCTransaction[]
  ) => {},
  UpdateCIBCTransaction: (data: any) => {},
  GetNewCIBCTransactions: (data: any, balancePage: boolean) => {},
});

export const CIBCTransactionsProvider = ({ children }: { children: any }) => {
  const [CIBCTransactions, setCIBCTransactions] = useState<CIBCTransaction[]>(
    []
  );
  const [BalanceCIBCTransactions, setBalanceCIBCTransactions] = useState<
    CIBCTransaction[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);
  const [cibcDebitBalance, setCibcDebitBalance] = useState(0);
  const [cibcCreditBalance, setCibcCreditBalance] = useState(0);

  // Fetching CIBC Transactions from the database
  const FetchCIBCTransactions = useCallback(async (latestYear = true) => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/mongoDB/fetchCIBCTransactions", {
        params: { latestYear },
      });
      const transformedData = response.data.map((transaction: any) => ({
        id: transaction.transactionId,
        date: new Date(transaction.date).toLocaleDateString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        transaction: transaction.merchantName || "Unknown",
        amount: transaction.amount,
        category: transaction.category[0],
        verified: transaction.pending ? "Pending" : "Verified",
      }));
      setCIBCTransactions(transformedData);
      setBalanceCIBCTransactions(transformedData);
      if (!latestYear) {
        setMonth("All");
        setYear("Transactions");
      } else {
        setMonth("");
        setYear(new Date().getFullYear().toString());
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // include all setters and other dependencies

  // Delete a CIBC Transaction form Frontend
  const DeleteCIBCTransaction = (transactionId: string) => {
    // finding the index of the transaction with the transactionId
    const deletedTransaction = CIBCTransactions.find(
      (transaction: CIBCTransaction) => transaction.id === transactionId
    );

    // Delete transaction with the transactionId from the CIBCTransactions array
    const newTransactions = CIBCTransactions.filter(
      (transaction: CIBCTransaction) => transaction.id !== transactionId
    );

    setCIBCTransactions([...newTransactions]);
    DeleteCIBCTransactionFromBackend(
      transactionId,
      deletedTransaction,
      newTransactions
    );
  };

  // Delete a CIBC Transaction from the backend
  const DeleteCIBCTransactionFromBackend = async (
    id: string,
    deletedTransaction: CIBCTransaction | undefined,
    newTransactions: CIBCTransaction[]
  ) => {
    const response = await axios.delete(
      `/api/mongoDB/deleteTransaction?transactionId=${id}`
    );
    const data = response.data;

    toast(
      `Your ${
        data.transaction.merchantName ? data.transaction.merchantName : ""
      } transaction has been deleted`,
      {
        description: new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        action: {
          label: "Undo",
          onClick: () =>
            RestoreCIBCTransaction(
              deletedTransaction as CIBCTransaction,
              newTransactions,
              data.transaction
            ),
        },
      }
    );
  };

  // Restore a CIBC Transaction both from the frontend and backend
  const RestoreCIBCTransaction = async (
    deletedTransaction: CIBCTransaction | undefined,
    newTransactions: CIBCTransaction[],
    originalTransaction: any
  ) => {
    try {
      const currentTransactions = [...CIBCTransactions];

      if (!currentTransactions.some((t) => t.id === deletedTransaction?.id)) {
        newTransactions = [
          ...newTransactions,
          deletedTransaction as CIBCTransaction,
        ];

        // Sort the CIBCTransactions array by the date property, from the most recent to the oldest
        newTransactions.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setCIBCTransactions(newTransactions);
      } else {
        setCIBCTransactions(currentTransactions);
      }
      // Putting the deleted transaction back into the database
      const response = await axios
        .post("/api/mongoDB/postTransactions", originalTransaction)
        .then(() => {
          {
            toast(
              `Your ${
                deletedTransaction?.transaction
                  ? deletedTransaction.transaction
                  : ""
              } transaction has been restored :)`,
              {
                position: "top-center",
                style: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }
            );
          }
        });
    } catch (error) {
      console.error(
        "There was an error storing the transaction from Undo!",
        error
      );
    }
  };

  // Delete Mutliple CIBC Transactions from the frontend
  const DeleteAllSelectedRows = async (table: any) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    const deletedTransactions = selectedRows.map((row: any) => {
      return row.original;
    });

    // Now you can use deletedTransactions to filter out CIBCTransactions or for other operations
    const newTransactions = CIBCTransactions.filter(
      (transaction: CIBCTransaction) =>
        !deletedTransactions.some(
          (item: CIBCTransaction) => item.id === transaction.id
        )
    );

    setCIBCTransactions(newTransactions);

    await DeleteMultipleCIBCTransactionsFromBackend(
      deletedTransactions,
      newTransactions
    );

    table.resetRowSelection();
  };

  // Delete Mutliple CIBC Transactions from the backend
  const DeleteMultipleCIBCTransactionsFromBackend = async (
    deletedTransactions: CIBCTransaction[],
    updatedTransactions: CIBCTransaction[]
  ) => {
    try {
      const response = await axios.delete(
        "/api/mongoDB/deleteMultipleTransactions",
        {
          data: deletedTransactions,
        }
      );
      const fullDeletedTransactionData =
        response.data.fullDeletedTransactionData;
      toast(`Multiple transactions have been deleted!`, {
        description: new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        action: {
          label: "Undo",
          onClick: () =>
            RestoreMultipleCIBCTransactions(
              deletedTransactions,
              updatedTransactions,
              fullDeletedTransactionData
            ),
        },
      });
    } catch (error) {
      console.error("There was an error deleting the transaction!", error);
    }
  };

  // Restore Mutliple CIBC Transactions from both the frontend and backend
  const RestoreMultipleCIBCTransactions = async (
    deletedTransactions: CIBCTransaction[],
    updatedTransactions: CIBCTransaction[],
    fullDeletedTransactionData: any
  ) => {
    try {
      let newTransactions = [...updatedTransactions, ...deletedTransactions];
      newTransactions.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setCIBCTransactions([...newTransactions]);

      for (const deletedTransaction of fullDeletedTransactionData) {
        await axios.post("/api/mongoDB/postTransactions", deletedTransaction);
      }
      toast(`Multiple transactions have been restored :)`, {
        position: "top-center",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }, // Centering the text
      });
    } catch (e) {
      console.error("There was an error storing the transaction from Undo!", e);
    }
  };

  // Update a CIBC Transaction on the frontend and backend
  const UpdateCIBCTransaction = async (data: any) => {
    CIBCTransactions.map((transaction: CIBCTransaction) => {
      if (transaction.id === data.id) {
        transaction.transaction = data.name;
        transaction.amount = data.amount;
        transaction.date = new Date(data.date).toLocaleDateString();
        transaction.category = data.category;
        transaction.verified = data.verified ? "Verified" : "Pending";
      }
    });
    setCIBCTransactions([...CIBCTransactions]);
    try {
      await axios.post("/api/mongoDB/updateCIBCTransaction", data);
      toast(`${data.name ? data.name : ""} Transaction has been updated :)`, {
        position: "top-center",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }, // Centering the text
      });
    } catch (error) {
      console.error("There was an error updating the transaction!", error);
    }
  };

  // Fetch new CIBC Transactions based on the year and month from the database
  const GetNewCIBCTransactions = async (
    data: any,
    balancePage: boolean = false
  ) => {
    console.log("this is the balance page", balancePage);
    setIsLoading(true);
    try {
      await axios
        .get(
          `/api/mongoDB/newTransactions?year=${data.year}&month=${data.month}`
        )
        .then((newdata) => {
          const newColumns = newdata.data.map((transaction: any) => ({
            id: transaction.transactionId,
            date: new Date(transaction.date).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            transaction: transaction.merchantName
              ? transaction.merchantName
              : "UnKnown",
            amount: transaction.amount,
            category: transaction.category[0],
            verified: transaction.pending ? "Pending" : "Verified",
          }));
          if (balancePage) {
            setBalanceCIBCTransactions([...newColumns]);
          } else {
            setCIBCTransactions([...newColumns]);
            setMonth(data.month);
            setYear(data.year);
          }
          // setCIBCTransactions(newColumns);

          setIsLoading(false);
        });
    } catch (error) {
      console.error("There was an error fetching the transactions!", error);
    }
  };

  // Fetch CIBC Balances from the database
  const FetchCIBCBalances = async () => {};

  return (
    <CIBCTransactionsContext.Provider
      value={{
        CIBCTransactions,
        BalanceCIBCTransactions,
        isLoading,
        month,
        year,
        totalSpent,
        FetchCIBCTransactions,
        FetchCIBCBalances,
        setCIBCTransactions,
        setBalanceCIBCTransactions,
        setTotalSpent,
        setIsLoading,
        setMonth,
        setYear,
        DeleteCIBCTransaction,
        DeleteCIBCTransactionFromBackend,
        DeleteAllSelectedRows,
        RestoreCIBCTransaction,
        DeleteMultipleCIBCTransactionsFromBackend,
        RestoreMultipleCIBCTransactions,
        UpdateCIBCTransaction,
        GetNewCIBCTransactions,
      }}
    >
      {children}
    </CIBCTransactionsContext.Provider>
  );
};

export const useCIBCTransactions = () => useContext(CIBCTransactionsContext);

///////////////////////////////////OpenAI Calls/////////////////////////////////////
const OpenAIContext = createContext({
  openAIResponse: "",
  BudgetProChat: () => {},
  BudgetProSummary: () => {},
});
export const OpenAIProvider = ({ children }: { children: any }) => {
  const [openAIResponse, setOpenAIResponse] = useState("");
  function BudgetProChat() {
    const [messages, setMessages] = useState([] as any);
    const [isLoading, setIsLoading] = useState(false);
    const [currentMessage, setCurrentMessage] = useState("");
    const [prompt, setPrompt] = useState("");
    const messagesContainerRef = useRef(null);

    const options = {
      api: "/api/openAI/budgetProChat",
    };

    const handleInputChange = (e: any) => {
      setCurrentMessage(e.target.value);
    };

    useEffect(() => {
      async function fetchPrompt() {
        try {
          const response: any = await axios.get("/api/openAI/aiPrompt");
          // console.log("this is the response", response.data.prompt);
          const prompt = response.data.prompt;
          setPrompt(prompt);
        } catch (error) {
          console.error("Error fetching prompt:", error);
        }
      }
      fetchPrompt();
    }, []);

    useEffect(() => {
      // Scroll to the bottom of the messages container
      if (messagesContainerRef.current) {
        (messagesContainerRef.current as any).scrollTop = (
          messagesContainerRef.current as any
        ).scrollHeight;
      }
    }, [messages]);

    const handleSubmit = async (e: any) => {
      setIsLoading(true);
      e.preventDefault();
      if (messages.length === 0) {
        const newMessages = [
          {
            role: "system",
            content: prompt,
          },
          { role: "user", content: currentMessage },
        ];
        setMessages(newMessages);
        setCurrentMessage("");
        try {
          const response = await axios.post(options.api, {
            messages: [
              {
                role: "system",
                content: prompt,
              },
              { role: "user", content: currentMessage },
            ],
          });
          const newMessage = response.data;
          setMessages([...newMessages, newMessage]);
          setIsLoading(false);
        } catch (error) {
          console.error("There was an error calling OpenAI!", error);
        }
      } else {
        const newMessages = [
          ...messages,
          { role: "user", content: currentMessage },
        ];
        setMessages(newMessages);
        setCurrentMessage("");
        try {
          const response = await axios.post(options.api, {
            messages: [...messages, { role: "user", content: currentMessage }],
          });
          console.log("these are the new messasges: ", response.data);
          const newMessage = response.data;
          setMessages([...newMessages, newMessage]);
          setIsLoading(false);
        } catch (error) {
          console.error("There was an error calling OpenAI!", error);
        }
      }
    };

    return (
      <div className="chat-container">
        {isLoading && (
          <div className="loading">
            <Image src="/gear.svg" width={80} height={80} alt="Loading" />
          </div>
        )}
        <div ref={messagesContainerRef} className="messages-container">
          {messages.slice(1).map((m: any, index: any) => (
            <div
              key={index}
              className={`message ${
                m.role === "user" ? "user-message" : "ai-message"
              }`}
            >
              <span className="message-role">
                {m.role === "user" ? "You: " : "AI: "}
              </span>
              <span
                className="message-content"
                dangerouslySetInnerHTML={{ __html: m.content }}
              ></span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="chat-form">
          <input
            className="chat-input outline-none"
            value={currentMessage}
            placeholder="Ask me anything :)"
            onChange={handleInputChange}
          />
        </form>
      </div>
    );
  }

  async function BudgetProSummary() {
    try {
      const response = await axios.post("/api/openAI/testing");
      console.log("this is the response", response);
      const message = response.data.choices[0].message.content;
      console.log(
        "We are getting here",
        response.data.choices[0].message.content
      );
      setOpenAIResponse(message);
      // return response.data;
    } catch (error) {
      console.error("There was an error calling OpenAI!", error);
    }
  }

  return (
    <OpenAIContext.Provider
      value={{ BudgetProChat, BudgetProSummary, openAIResponse }}
    >
      {children}
    </OpenAIContext.Provider>
  );
};

export const useOpenAI = () => useContext(OpenAIContext);
///////////////////////////////////PLAID Transactions/////////////////////////////////////
// Uncomment this function to store the transactions in the database for the development environment

export function usePostTrans() {
  const { session } = useSession();

  const postTrans = async () => {
    if (!session) {
      console.error("Session not found, user must be logged in.");
      return;
    }

    const user_id = session.user.id;

    try {
      const response = await axios.get("/api/plaid/cibcTransactions", {
        params: {
          user_id: user_id,
        },
      });
      console.log(
        "Transactions have been posted successfully!",
        response.data.latest_transactions
      );
      // Uncomment for toast message
      // toast("Transactions have been posted successfully!", {
      //   position: "top-center",
      //   style: {
      //     display: "flex",
      //     justifyContent: "center",
      //     alignItems: "center",
      //   },
      // });
    } catch (error) {
      console.error("There was an error getting the transactions!", error);
    }
  };

  return postTrans;
}

// const getTrans = async () => {
//   try {
//     const response = await axios.get(
//       `/api/plaid/transactions?userId=${user_id}`
//     );
//   } catch (error) {
//     console.error("There was an error!", error);
//   }
// }
