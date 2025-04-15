import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
  InfoIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import { IoMdInformationCircleOutline } from "react-icons/io";

export default function OverallMetrics() {
  const accountData = [
    {
      title: "Overall Profit/Loss",
      value: "+$0",
      info: "Total P/L represents only realized wins and losses.",
    },
    {
      title: "Daily Lowest Equity",
      value: "$0",
      info: "Daily lowest equity represents the accounts lowest value in the current 24 hour period",
    },
  ];

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* <!-- Metric Item Start --> */}
      {/* <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              3,782
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div> */}

      {/* Balance Card */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center py-2 bg-gray-100 rounded-t-xl dark:bg-gray-800 text-gray-800 text-xl dark:text-white/90 gap-1">
          <div>Account Balance</div>
        </div>
        <div className="flex items-end justify-center p-3">
          <div className="text-green-400 menu-item my-2 font-bold text-2xl w-fit px-4 ">
            $0
          </div>
        </div>
      </div>
      {/* Equity Card */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center py-2 bg-gray-100 rounded-t-xl dark:bg-gray-800 text-gray-800 text-xl dark:text-white/90 gap-1">
          <div>Account Equity</div>
        </div>
        <div className="flex items-end justify-center p-3">
          <div className=" menu-item my-2 font-bold w-fit px-4 text-gray-800 text-2xl dark:text-white/90">
            $0
          </div>
        </div>
      </div>

      {/* Platform Card */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center py-2 bg-gray-100 rounded-t-xl dark:bg-gray-800 text-gray-800 text-xl dark:text-white/90 gap-1">
          <div>Daily P&L</div>
        </div>
        <div className="flex items-end justify-center p-3">
          <div className="menu-item menu-item-active my-2 font-bold text-2xl w-fit px-4">
            +0
          </div>
        </div>
      </div>

      {/* Time Remaining Card */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center py-2 bg-gray-100 rounded-t-xl dark:bg-gray-800 text-gray-800 text-xl dark:text-white/90 gap-1">
          <div>Highest Profit Day</div>
        </div>
        <div className="flex items-center justify-center p-3 flex-col">
          <div className="text-green-400  my-2 font-semibold text-2xl w-fit px-4 ">
            +$0
          </div>
          <div className="text-gray-800 text-lg dark:text-white/90 w-fit px-4 ">
            {formattedDate}
          </div>
        </div>
      </div>

      {/* <!-- Metric Item Start --> */}
      {accountData.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="flex items-center justify-center py-2 bg-gray-100 rounded-t-xl dark:bg-gray-800 text-gray-800 text-xl dark:text-white/90 gap-1">
            <div>{item.title}</div>
            <Tippy content={item.info}>
              <IoMdInformationCircleOutline className="text-gray-800 size-4 dark:text-white/90" />
            </Tippy>
          </div>
          <div className="flex items-end justify-center p-3 ">
            <h4 className="my-2 font-bold text-gray-800 text-2xl dark:text-white/90">
              {item.value}
            </h4>
          </div>
        </div>
      ))}

      {/* <!-- Metric Item End --> */}
    </div>
  );
}
