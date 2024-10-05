import toast from "react-hot-toast";

const toaster = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
};

export default toaster;
