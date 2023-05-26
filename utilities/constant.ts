import { ToastOptions } from "react-toastify";

export const countryDataWithCode: {
  code: string;
  name: string;
}[] = [
  {
    name: "Singapore",
    code: "+65",
  },
  {
    name: "Indonesia",
    code: "+62",
  },
  {
    name: "India",
    code: "+91",
  },
  {
    name: "Netherlands",
    code: "+31",
  },
  {
    name: "Nepal",
    code: "+977",
  },
  {
    name: "China",
    code: "+86",
  },
  {
    name: "Australia",
    code: "+61",
  },
  {
    name: "Bangladesh",
    code: "+880",
  },
  {
    name: "Canada",
    code: "+1",
  },
  {
    name: "Philippines",
    code: "+63",
  },
  {
    name: "Portugal",
    code: "+351",
  },
];

export const baseAPIPath = "http://localhost:4200";

export const APIRoutes = {
  register: "api/register",
};

export const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};
