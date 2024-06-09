import {
  IconX,
  IconCircleCheckFilled,
  IconExclamationCircle,
  IconRefreshAlert,
} from "@tabler/icons-react";

type AlertPropType = {
  type: "success" | "error" | "update";
  show: boolean;
};

export const Alert = ({ type, show }: AlertPropType) => {
  if (!show) return null;

  let background = "";
  let border = "";
  let color = "";
  let Icon = IconCircleCheckFilled;
  let message = "";

  switch (type) {
    case "success":
      background = "bg-green-100";
      border = "bg-green-400";
      color = "text-green-800";
      Icon = IconCircleCheckFilled;
      message = "Form Submitted!";
      break;
    case "error":
      background = "bg-red-100";
      border = "bg-red-400";
      color = "text-red-800";
      Icon = IconExclamationCircle;
      message = "Form Error!";
      break;
    case "update":
      background = "bg-yellow-100";
      border = "bg-yellow-400";
      color = "text-yellow-800";
      Icon = IconRefreshAlert;
      message = "Form Updated!";
      break;
  }

  return (
    <div
      className={`interestForm-notification success-notification flex flex-row items-center justify-center h-full ${background} rounded-lg shadow-lg`}>
      <div className={`w-[6px] h-[32px] ${border} rounded-md mx-2`}></div>
      <div
        className={`flex flex-row items-center justify-center gap-2 py-2 pr-4`}>
        <Icon className={`${color}`} />
        <span className={`text-lg font-bold ${color}`}>{message}</span>
        <button
          className={`p-[2px] rounded-lg hover:${background} cursor-pointer`}
          onClick={(event) => {
            event.stopPropagation();
          }}>
          <IconX size={20} stroke={3} className={`${color}`} />
        </button>
      </div>
    </div>
  );
};
