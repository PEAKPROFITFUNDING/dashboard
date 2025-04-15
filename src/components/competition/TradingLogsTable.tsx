import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { tradeData } from "../../data/tradeData";

// Define the table data using the interface

export default function TradingLogsTable() {
  // Common cell styles
  const headerCellClasses =
    "px-5 py-3 text-gray-500 text-start dark:text-gray-400 whitespace-nowrap";
  const bodyCellClasses =
    "px-4 py-3 text-gray-500 text-start dark:text-gray-400 whitespace-nowrap";

  const tableHeaders = [
    "Open",
    "Symbol",
    "Position ID",
    "Type",
    "Volume",
    "Price",
    "S/L",
    "T/P",
    "Close",
    "Close Price",
    "P/L",
    "Change",
  ];

  return (
    <div className="border border-gray-200 rounded-xl bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="text-gray-800 text-2xl dark:text-white/90 font-semibold pl-4 pt-3">
        Trading Logs
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell isHeader key={index} className={headerCellClasses}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tradeData && tradeData.length > 0 ? (
                tradeData.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap">
                      {trade.openTime}
                    </TableCell>
                    <TableCell
                      className={`${bodyCellClasses} text-gray-800 dark:text-white/90`}
                    >
                      {trade.symbol}
                    </TableCell>
                    <TableCell className={bodyCellClasses}>
                      {trade.positionId}
                    </TableCell>
                    <TableCell
                      className={`${bodyCellClasses.replace(
                        "text-gray-500 dark:text-gray-400",
                        ""
                      )}`}
                    >
                      <Badge
                        size="sm"
                        color={trade.type === "Buy" ? "success" : "error"}
                      >
                        {trade.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={bodyCellClasses}>
                      {trade.volume.toFixed(1)}
                    </TableCell>
                    <TableCell className={bodyCellClasses}>
                      {trade.price.toFixed(4)}
                    </TableCell>
                    <TableCell className={bodyCellClasses}>
                      {trade.stopLoss.toFixed(4)}
                    </TableCell>
                    <TableCell className={bodyCellClasses}>
                      {trade.takeProfit.toFixed(4)}
                    </TableCell>
                    <TableCell className={bodyCellClasses}>
                      {trade.closeTime}
                    </TableCell>
                    <TableCell className={bodyCellClasses}>
                      {trade.closePrice.toFixed(4)}
                    </TableCell>
                    <TableCell
                      className={`${bodyCellClasses.replace(
                        "text-gray-500 dark:text-gray-400",
                        ""
                      )} ${
                        trade.profitLoss >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {trade.profitLoss.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`${bodyCellClasses.replace(
                        "text-gray-500 dark:text-gray-400",
                        ""
                      )} ${
                        trade.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {trade.change >= 0 ? "+" : ""}
                      {trade.change.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="pl-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No trading data available yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
