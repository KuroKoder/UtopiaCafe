import flowOrderImage from "../img/floworder.jpg";
import orderImage from "../img/order.jpg";
import customerImage from "../img/customer.jpg";

export const navLinks = [
  {
    id: 1,
    path: "",
    text: "Home Page",
  },
  {
    id: 2,
    path: "flow",
    text: "Flow Order",
  },
  {
    id: 3,
    path: "order",
    text: "Order",
  },
  {
    id: 4,
    path: "cs",
    text: "Customer Service",
  },
];

export const cardData = [
  {
    id: 1,
    imgSrc: flowOrderImage,
    title: "Flow Order",
    description: "Click here to view how to make an order.",
    link: "/flow",
    linkText: "Flow Order",
  },
  {
    id: 2,
    imgSrc: orderImage,
    title: "Menu Order",
    description: "Click here to view the menu and place an order.",
    link: "/order",
    linkText: "Menu Order",
  },
  {
    id: 3,
    imgSrc: customerImage,
    title: "Customer Service",
    description:
      "Feel free to reach out to our customer service team for any assistance you may need.",
    link: "/cs",
    linkText: "Our Customer Service",
  },
];
