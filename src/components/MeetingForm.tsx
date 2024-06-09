import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  MeetingDay,
  MeetingHour,
  MeetingMeridiem,
  MeetingMinute,
  MeetingTime,
  Meeting,
} from "@/types/meeting.d";

import debounce from "lodash/debounce";
// meeting day options

const dayOptions: MeetingDay[] = [
  "Mon",
  "Tues",
  "Wed",
  "Thurs",
  "Fri",
  "Sat",
  "Sun",
];

type ValidOptions = "day" | "hour" | "minute" | "location";

import { IconMoonFilled } from "@tabler/icons-react";
import { IconSunFilled } from "@tabler/icons-react";
import { IconTriangleFilled } from "@tabler/icons-react";
import { set } from "lodash";

// meeting hour options
const hourOptions: MeetingHour[] = [12 as MeetingHour].concat(
  Array.from({ length: 11 }, (_, i) => (i + 1) as MeetingHour)
);

// meeting minute options
const minuteOptions: MeetingMinute[] = Array.from(
  { length: 4 },
  (_, i) => (i * 15) as MeetingMinute
);

// meeting time options
const meetingTimes: string[] = Array.from(hourOptions, (hour) =>
  Array.from(
    minuteOptions,
    (minute) =>
      `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
  )
).flat();

// TimeSelection Component Props
type TimeSelectionPropType = {
  id: number;
  meeting: Meeting;
  setMeeting: (meeting: Meeting) => void;
  isEmpty: boolean;
};

// UI Input Component for Time Selection
export default function MeetingForm(props: TimeSelectionPropType) {
  const { meeting, setMeeting } = props;

  const [meridiem, setMeridiem] = useState<MeetingMeridiem>(
    meeting.time?.meridiem ? meeting.time.meridiem : "am"
  );
  const [inputMeetingTime, setInputMeetingTime] = useState<string>(
    meeting.time?.hour && (meeting.time?.minute || meeting.time?.minute === 0)
      ? `${
          meeting.time.hour < 10
            ? `0${meeting.time.hour}`
            : meeting.time.hour.toString()
        }:${
          meeting.time.minute < 10
            ? `0${meeting.time.minute}`
            : meeting.time.minute.toString()
        }`
      : ""
  );
  const [meetingTimeResults, setMeetingTimeResults] =
    useState<string[]>(meetingTimes);
  const [showMeetingTimes, setShowMeetingTimes] = useState<Boolean>(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);

  const [showDayOptions, setShowDayOptions] = useState<Boolean>(false);

  const focusedMeetingTime = useRef<HTMLDivElement>(null);

  const [meetingFormData, setMeetingFormData] = useState<Meeting>(meeting);

  const [inputHour, setInputHour] = useState<string | undefined>(
    meetingFormData.time?.hour
      ? meetingFormData.time.hour < 10
        ? `0${meetingFormData.time.hour}`
        : meetingFormData.time.hour.toString()
      : ""
  );
  const [inputMinute, setInputMinute] = useState<string | undefined>(
    meetingFormData.time?.minute || meetingFormData.time?.minute === 0
      ? meetingFormData.time.minute < 10
        ? `0${meetingFormData.time.minute}`
        : meetingFormData.time.minute.toString()
      : ""
  );
  const minuteInputRef = useRef<HTMLInputElement>(null);

  const [isValidMeeting, setIsValidMeeting] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState(false);

  const [validOption, setValidOption] = useState<ValidOptions | undefined>();

  /* Handlers for Meeting Time */
  const handleHourChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    if (value === "") {
      setInputHour("");
      setMeetingFormData({
        ...meetingFormData,
        time: { ...meetingFormData.time, hour: null },
      });
    } else {
      let newHour = parseInt(value);
      if (newHour >= 1 && newHour <= 12) {
        setIsValidMeeting(true);
        setInputHour(newHour < 10 ? `0${newHour}` : newHour.toString());
        setMeetingFormData({
          ...meetingFormData,
          time: { ...meetingFormData.time, hour: newHour as MeetingHour },
        });
      } else {
        if (!isValidMeeting) {
          setInputHour("");
          setMeetingFormData({
            ...meetingFormData,
            time: { ...meetingFormData.time, hour: null },
          });
        }
        setIsValidMeeting(false);
        setValidOption("hour");
      }
    }
  };

  const handleMinuteChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = e.target.value;

    if (value === "") {
      setInputMinute("");
      setMeetingFormData({
        ...meetingFormData,
        time: { ...meetingFormData.time, minute: null },
      });
    } else {
      let newMinute = parseInt(value);
      if (newMinute >= 0 && newMinute <= 59) {
        setIsValidMeeting(true);
        setInputMinute(newMinute < 10 ? `0${newMinute}` : newMinute.toString());
        setMeetingFormData({
          ...meetingFormData,
          time: { ...meetingFormData.time, minute: newMinute },
        });
      } else {
        if (!isValidMeeting) {
          setInputMinute(undefined);
        }
        setIsValidMeeting(false);
        setValidOption("minute");
      }
    }
  };
  const handleMeridiemChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setMeridiem("pm");
      setMeetingFormData({
        ...meetingFormData,
        time: { ...meetingFormData.time, meridiem: "pm" },
      });
    } else {
      setMeridiem("am");
      setMeetingFormData({
        ...meetingFormData,
        time: { ...meetingFormData.time, meridiem: "am" },
      });
    }
  };
  /* Callback for Meeting Time */

  // reset meeting search
  const resetMeetingSearch = useCallback(() => {
    setFocusedIdx(-1);
    setShowMeetingTimes(false);
    setShowDayOptions(false);
  }, []);

  // get final meeting time selection
  const getMeetingTimeSelection = useCallback(
    (input: string) => {
      const hourRegex = /^(0?[1-9]|1[0-2])$/;
      const minuteRegex = /^([0-5][0-9])?$/;
      const [hour, minute] = input.split(":");

      if (hourRegex.test(hour) && minuteRegex.test(minute)) {
        const parsedHour = parseInt(hour);
        const parsedMinute = parseInt(minute);
        setMeetingFormData({
          time: {
            hour: parsedHour as MeetingHour,
            minute: parsedMinute as MeetingMinute,
            meridiem: meridiem as MeetingMeridiem,
          } as MeetingTime,
        });
        setInputMeetingTime(input);
        setMeetingTimeResults([]);
        resetMeetingSearch();
      }
    },
    [meridiem, resetMeetingSearch]
  );

  const [location, setLocation] = useState<string>(
    meetingFormData.location ? meetingFormData.location : ""
  );

  /* Hooks for Meeting Time */

  // update meeting times on meridiem change
  useEffect(() => {
    if (meridiem !== null) {
      getMeetingTimeSelection(inputMeetingTime);

      if (meetingFormData.time?.hour || meetingFormData.time?.minute) {
        setMeetingFormData({
          ...meetingFormData,
          time: { ...meetingFormData.time, meridiem: meridiem },
        });
      }
    }
  }, [
    meridiem,
    inputHour,
    inputMinute,
    getMeetingTimeSelection,
    inputMeetingTime,
  ]);

  const [day, setDay] = useState<MeetingDay | string>(
    meetingFormData.day ? meetingFormData.day : ""
  );

  // When day changes, update meeting day
  useEffect(() => {
    if (day && dayOptions.includes(day as MeetingDay)) {
      setMeetingFormData({ ...meetingFormData, day: day as MeetingDay });
    }
  }, [day]);

  // When location changes, update meeting location
  useEffect(() => {
    if (location) {
      setMeetingFormData({ ...meetingFormData, location: location });
    } else if (location === "") {
      setMeetingFormData({ ...meetingFormData, location: "" });
    }
  }, [location]);

  //when meeting is empty, clear all of the values
  useEffect(() => {
    if (props.isEmpty) {
      clearMeeting();
    }
  }, [props.isEmpty]);

  // update meeting times on meridiem change
  useEffect(() => {
    setMeeting(meetingFormData);
  }, [meetingFormData]);

  const clearMeeting = () => {
    setInputMeetingTime("");
    setInputHour("");
    setInputMinute("");
    setDay("");
    setLocation("");
    setMeridiem("am");
  };

  return (
    <>
      <div
        className="relative inline-block w-full"
        onBlur={resetMeetingSearch}
        tabIndex={1}
      >
        <div
          className={`flex flex-row items-center border-2 py-1 rounded-xl w-full ${
            isValidMeeting && props.isEmpty ? "border-[#B3B3B3]" : ""
          }${!isValidMeeting ? "border-red-300" : ""}`}
        >
          <div className="px-2 ml-2 font-medium outline-none w-14 text-start">
            <AutoCompleteDay
              inputValue={day ?? ""}
              setInputValue={setDay}
              isValidMeeting={isValidMeeting}
              setIsValidMeeting={setIsValidMeeting}
              setValidOption={setValidOption}
            />
          </div>
          <div
            className={`flex flex-row items-center gap-2 px-2  border-l-2 border-r-2 border-zinc-200"
            `}
          >
            <style>
              {`input::placeholder {
                          font-weight: 500 ;
                          font-size: 0.9rem;
                          }`}
            </style>

            <div className="flex items-center justify-center space-x-0 font-medium outline-none">
              {/* Hour Input */}
              <input
                type="text"
                placeholder="--"
                className="font-medium text-center outline-none text-zinc-600"
                onChange={handleHourChange}
                value={inputHour}
                style={{ width: "20px" }}
              />

              <span>:</span>

              {/* Minute Input */}
              <input
                ref={minuteInputRef}
                type="text"
                placeholder="--"
                className="py-1 font-medium text-center outline-none text-zinc-600"
                onChange={handleMinuteChange}
                value={inputMinute}
                style={{ width: "20px" }}
              />
            </div>

            {/* Meridiem Toggle Switch */}

            <div className="flex items-center justify-center sm:hidden">
              <label
                htmlFor={`meridiem${props.id}`}
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    id={`meridiem${props.id}`}
                    type="checkbox"
                    className="hidden"
                    checked={meridiem === "pm"}
                    onChange={(e) => {
                      handleMeridiemChange(e);
                      setIsShaking(true);
                      setTimeout(() => setIsShaking(false), 300);
                    }}
                  />
                  <div
                    className="relative flex items-center justify-between w-8 h-8 px-3 text-sm font-bold text-gray-700 bg-gray-400 shadow-inner rounded-2xl"
                    style={{
                      transition: "background-color 0.3s ease-in-out",
                      backgroundColor:
                        meridiem === "am" ? "#ffeaa7" : "#74b9ff",
                    }}
                  ></div>
                  <div
                    className="absolute flex items-center justify-center w-6 h-6 bg-white shadow rounded-xl left-1 top-1"
                    style={{
                      transition: "all 0.3s ease-in-out",
                      transform: meridiem === "pm" ? "" : "",
                    }}
                  >
                    {meridiem === "am" ? (
                      <IconSunFilled
                        size={16}
                        style={{
                          color: "#FDB813",
                          transition: "all 0.4s ease-in-out",
                          transform: isShaking
                            ? "scale(1.25) rotate(-25deg)"
                            : "",
                        }}
                      />
                    ) : (
                      <IconMoonFilled
                        size={16}
                        style={{
                          color: "#57a0cf",
                          transition: "all 0.4s ease-in-out",
                          transform: isShaking
                            ? "scale(1.25) rotate(25deg)"
                            : "",
                        }}
                      />
                    )}
                  </div>
                </div>
              </label>
            </div>
            <div className="items-center justify-center hidden sm:flex ">
              <label
                htmlFor={`meridiem${props.id}`}
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    id={`meridiem${props.id}`}
                    type="checkbox"
                    className="hidden"
                    checked={meridiem === "pm"}
                    onChange={(e) => {
                      handleMeridiemChange(e);
                      setIsShaking(true);
                      setTimeout(() => setIsShaking(false), 300);
                    }}
                  />
                  <div
                    className="w-[65px] h-8 bg-gray-400 rounded-2xl shadow-inner flex items-center justify-between px-3 gap-[5px] text-sm font-bold text-gray-700"
                    style={{
                      transition: "background-color 0.3s ease-in-out",
                      backgroundColor:
                        meridiem === "am" ? "#ffeaa7" : "#74b9ff",
                    }}
                  >
                    <span className="text-xs font-semibold">PM</span>
                    <span className="-mr-1 text-xs font-semibold">AM</span>
                  </div>
                  <div
                    className="absolute top-1 left-[7px] w-6 h-6 bg-white rounded-xl shadow flex items-center justify-center"
                    style={{
                      transition: "all 0.3s ease-in-out",
                      transform: meridiem === "pm" ? "translateX(120%)" : "",
                    }}
                  >
                    {meridiem === "am" ? (
                      <IconSunFilled
                        size={16}
                        style={{
                          color: "#FDB813",
                          transition: "all 0.4s ease-in-out",
                          transform: isShaking
                            ? "scale(1.25) rotate(-25deg)"
                            : "",
                        }}
                      />
                    ) : (
                      <IconMoonFilled
                        size={16}
                        style={{
                          color: "#57a0cf",
                          transition: "all 0.4s ease-in-out",
                          transform: isShaking
                            ? "scale(1.25) rotate(25deg)"
                            : "",
                        }}
                      />
                    )}
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div className="w-[70%] px-2 ml-2">
            <input
              type="text"
              placeholder="Location"
              className="w-full font-medium outline-none text-start text-zinc-600"
              onChange={(e) => {
                const { value } = e.target;
                setLocation(value);

                if (value.trim() === "") {
                  setLocation("");
                }
              }}
              value={location}
            />
          </div>
        </div>

        {/*Error Message*/}
        <div className="absolute flex items-center justify-center position:">
          {!isValidMeeting && (
            <div className="relative flex items-center mt-1 text-xs text-red-500 position: left-2">
              <IconTriangleFilled size={12} style={{ color: "#ff0000" }} />
              <span className="ml-1">
                {validOption == "day"
                  ? "Please input a valid day"
                  : validOption == "hour"
                  ? "Please input a valid hour"
                  : "Please input a valid minute"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

type AutoCompleteDayProps = {
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  isValidMeeting: boolean;
  setIsValidMeeting: (isValidMeeting: boolean) => void;
  setValidOption: (validOption: ValidOptions) => void;
};

const AutoCompleteDay = (props: AutoCompleteDayProps) => {
  const [suggestion, setSuggestion] = useState("");
  const inputRef = useRef(null);

  const findSuggestion = (input: string) => {
    if (input.length < 1) {
      return "";
    }

    for (let day of dayOptions) {
      if (day.toLowerCase().startsWith(input.toLowerCase())) {
        return day.slice(input.length);
      }
    }
    return "";
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Tab" || e.key == "Enter") && suggestion) {
      e.preventDefault();
      props.setInputValue(props.inputValue + suggestion);
      setSuggestion("");
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value as MeetingDay;
    props.setInputValue(day);
    const newSuggestion = findSuggestion(day);
    setSuggestion(newSuggestion);
    // Validate if the input value is part of the daysOfWeek
    if (dayOptions.includes(day)) {
      props.setInputValue(day);
      props.setIsValidMeeting(true);
    } else {
      // Else you can handle the error or fallback here
      props.setIsValidMeeting(false);
      props.setValidOption("day");
    }
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      className="w-10"
    >
      <input
        ref={inputRef}
        type="text"
        value={props.inputValue}
        onChange={handleDayChange}
        onKeyDown={onKeyDown}
        className="w-10 outline-none text-zinc-600"
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          zIndex: 2,
        }}
      />
      <input
        type="text"
        value={props.inputValue + suggestion}
        placeholder="Day"
        disabled
        className="w-10 outline-none text-zinc-300"
        style={{
          backgroundColor: "transparent",
          zIndex: 1,
        }}
      />
    </div>
  );
};
