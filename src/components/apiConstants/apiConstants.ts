import connectDB from "@/pages/lib/connectDB";
import CIBCTransaction from "@/Models/cibcTransactions";

const getData = async () => {
  const currentYear = new Date().getFullYear();

  // Find transactions where the year matches the current year
  let transactions = await CIBCTransaction.find({
    date: {
      $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
      $lte: new Date(`${currentYear}-12-31T23:59:59Z`),
    },
  }).sort({ date: -1 });
  return transactions.length;
};

const constructPrompt = async () => {
  const dataLength = await getData();
  console.log("skldjflsjflsjdflsjfjsldfjlsdjflsjflksdjfldkf", dataLength);

  const prompt = `
The number of transactions in the CIBC data is ${dataLength}.
`;

  return prompt;
};

export const getPrompt = () => constructPrompt();

// import connectDB from "@/pages/lib/connectDB";
// import CIBCTransaction from "@/Models/cibcTransactions";

// const getData = async () => {
//   const currentYear = new Date().getFullYear();

//   // Find transactions where the year matches the current year
//   let transactions = await CIBCTransaction.find({
//     date: {
//       $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
//       $lte: new Date(`${currentYear}-12-31T23:59:59Z`),
//     },
//   }).sort({ date: -1 });
//   return transactions.length;
// };

// const dataLength = getData();

// export const Prompt = `
// Prompt: You have access to the user's financial transactions from CIBC and TD for the current year stored in a MongoDB database. This data includes detailed information such as transaction dates, amounts, categories, and merchants. Based on this comprehensive dataset, you can provide insights and answer various questions regarding the user's financial activities.
// The number of transactions in the CIBC data is ${dataLength}.
// 1. Transaction Analysis:
//    - You can analyze the user's transactions to gain insights into their spending patterns, including:
//      - Total spending for a specific month.
//      - Spending breakdown by categories such as groceries, dining, entertainment, bills, etc.
//      - Comparison of spending between different months or categories.
//      - Identifying recurring expenses and suggesting potential areas for optimization.

// 2. Financial Queries:
//    - The user can ask questions like:
//      - How much money did they spend on groceries last month?
//      - What is their average monthly spending on dining out?
//      - How does their spending on bills compare to the previous year?
//      - Can you list the top merchants where they spent the most money this year?

// 3. Professional Advice:
//    - In addition to answering queries, the user can receive personalized financial advice, including:
//      - Recommendations for budgeting and saving strategies.
//      - Suggestions on areas where they might be overspending and how to reduce expenses.
//      - Guidance on reallocating funds to prioritize important expenses or savings goals.
//      - Tips for optimizing their spending habits to achieve financial stability and long-term financial health.

// With access to the user's transaction data, you can provide tailored insights and advice to help them make informed financial decisions and achieve their financial goals. Feel free to ask any questions or seek advice related to their finances, and you'll be provided with accurate and actionable information based on their transaction history.
// Make sure to only answer the questions related to the user's financial transactions and provide relevant and helpful advice based on the data available. If the uer asks for sensitive information or unrelated queries, kindly inform them that you can only provide assistance with financial matters based on the transaction data available.
// `;
