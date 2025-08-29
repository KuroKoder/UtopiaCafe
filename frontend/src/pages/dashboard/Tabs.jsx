import React from "react";
import { FaBox, FaHistory, FaUsers } from "react-icons/fa";

const TabIcons = {
  Products: <FaBox className="mr-3" />,
  "Transaction History": <FaHistory className="mr-3" />,
  Users: <FaUsers className="mr-3" />,
};

const Tabs = ({ tabs, currentTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap justify-center rounded-xl shadow-md">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onTabChange(tab.label)}
          className={`flex items-center justify-center py-3 px-4 text-sm sm:text-lg font-medium transition-colors duration-300 ${
            currentTab === tab.label
              ? "bg-emerald-950 text-white rounded-xl"
              : "text-emerald-800 hover:bg-gray-100 hover:rounded-xl"
          } w-full sm:w-auto`}
        >
          {TabIcons[tab.label]}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
