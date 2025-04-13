import React from "react";

import {
  MdTrendingDown,
  MdTrendingUp,
  MdAccessTime,
  MdEqualizer,
} from "react-icons/md";
import { AiOutlinePercentage } from "react-icons/ai";
import { FaChartLine } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { SlBadge } from "react-icons/sl";
import { CiBadgeDollar } from "react-icons/ci";
import { MdWindow } from "react-icons/md";
import { MdOutlineWindow } from "react-icons/md";
import { LuBadgeDollarSign } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";

const AverageMetrics = () => {
  const tradingStats = [
    {
      label: "Amount Of Trading Days",
      value: "120 Days",
      icon: LuCalendarDays,
      toolTip: "Total days traded",
    },
    {
      label: "Account Size",
      value: "$105,000",
      icon: MdTrendingUp,
      toolTip: "Account size as of now",
    },
    {
      label: "Win Rate",
      value: "60%",
      icon: SlBadge,
      toolTip: "Ratio of winning trades to losing trades",
    },
    {
      label: "Average Trade Duration",
      value: "2h 30m",
      icon: MdAccessTime,
      toolTip: "Average amount of time spent on each trade",
    },
    {
      label: "Profit Factor",
      value: "1.5",
      icon: LuBadgeDollarSign,
      toolTip: "Amount of profit per unit of risk",
    },
    {
      label: "Lots",
      value: "3.2",
      icon: MdOutlineWindow,
      toolTip:
        "Total loss traded througout competition. Chart shows daily volume",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tradingStats.map((statItem, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="flex items-center px-4 py-2 bg-gray-100 rounded-t-xl dark:bg-gray-800 text-gray-800 text-base dark:text-white/90 gap-1">
            <div>{statItem.label}</div>
            <Tippy content={statItem.toolTip}>
              <IoMdInformationCircleOutline className="text-gray-800 size-4 dark:text-white/90" />
            </Tippy>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-800  dark:text-white/90 font-semibold text-2xl w-fit px-4 ">
              {statItem.value}
            </div>
            <div className="text-gray-800 dark:text-white/90 font-semibold w-fit  ">
              {
                <statItem.icon
                  size={60}
                  className="menu-item text-brand-500  dark:text-brand-400"
                />
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AverageMetrics;
