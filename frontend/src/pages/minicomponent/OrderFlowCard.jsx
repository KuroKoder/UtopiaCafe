import React from "react";

const OrderFlowCard = ({ step, title, description, icon, customStyles }) => {
  return (
    <div
      className={`bg-secondary-color text-white rounded-lg p-6 shadow-md ${customStyles}`}
    >
      <div className="flex items-center mb-4">
        <div className="text-primary-color text-2xl font-bold mr-4">{step}</div>
        <div className="flex-shrink-0">{icon}</div>
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
};

export default OrderFlowCard;
