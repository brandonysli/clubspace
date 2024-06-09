"use client";

import Image from "next/image";
import LogoImage from "@/assets/images/logo.svg";
import { useEffect, useRef, useState } from "react";
import { InterestFormData, InterestForm } from "@/types/interestForm.d";
import { IconMessage2Question } from "@tabler/icons-react";
import "../styles/interestForm.css";
import { Alert } from "./Alert";

type InterestFormProps = {
  email?: string;
};

export default function InterestForm(props: InterestFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const formButtonRef = useRef<HTMLButtonElement>(null);

  const [showInterestForm, setShowInterestForm] = useState<boolean>(false);
  const [interestFormError, setInterestFormError] = useState<boolean>(false);
  const [interestFormSuccess, setInterestFormSuccess] =
    useState<boolean>(false);
  const [interestFormUpdate, setInterestFormUpdate] = useState<boolean>(false);

  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);

  const [submittingForm, setSubmittingForm] = useState<boolean>(false);

  const [formEmail, setFormEmail] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>();
  const [formOfficer, setFormOfficer] = useState<boolean>(false);
  const [formClubInfo, setFormClubInfo] = useState<boolean>(false);

  const handleInterestForm = () => {
    if (
      props.email ||
      formEmail.includes("@cornell.edu") ||
      formEmail.includes("@gmail.com") ||
      formEmail.includes("@yahoo.com")
    ) {
      setFormEmail("");
      setFormDescription("");
      setFormOfficer(false);
      setFormClubInfo(false);

      setSubmittingForm(true);

      fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/interestform`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: props.email ?? formEmail,
          description: formDescription,
          clubOfficer: formOfficer,
          addClubInfo: formClubInfo,
        } as InterestFormData),
      })
        .then((response) => response.json())
        .then((data) => {
          const interestFormStatus = data.status;
          if (interestFormStatus == "success") {
            setInterestFormError(false);
            setInterestFormSuccess(true);
            setTimeout(() => {
              setInterestFormSuccess(false);
            }, 5000);
            setInterestFormUpdate(false);
          } else if (interestFormStatus == "update") {
            setInterestFormError(false);
            setInterestFormSuccess(false);
            setInterestFormUpdate(true);
            setTimeout(() => {
              setInterestFormUpdate(false);
            }, 5000);
          } else {
            setInterestFormError(true);
            setTimeout(() => {
              setInterestFormError(false);
            }, 5000);
            setInterestFormSuccess(false);
            setInterestFormUpdate(false);
          }
        })
        .catch((error) => {
          setInterestFormError(true);
          setTimeout(() => {
            setInterestFormError(false);
          }, 5000);
          setInterestFormSuccess(false);
          setInterestFormUpdate(false);
        });

      setInvalidEmail(false);
      setShowInterestForm(false);
      setSubmittingForm(false);
    } else {
      setInvalidEmail(true);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!formButtonRef.current?.contains(event.target as Node)) {
        if (
          formRef.current &&
          !formRef.current.contains(event.target as Node)
        ) {
          setShowInterestForm(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick, false);

    return () => {
      document.removeEventListener("click", handleOutsideClick, false);
    };
  }, []);

  return (
    <>
      <div className="relative inline-block">
        <button
          ref={formButtonRef}
          className="flex flex-row items-center justify-center px-4 py-1 text-lg font-bold text-white bg-zinc-700 rounded-lg h-[48px] hover:bg-zinc-600 gap-1 "
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowInterestForm(!showInterestForm);
          }}>
          <span className="flex">Thoughts </span>
          <Image
            alt="clubspace logo"
            src={LogoImage}
            height={32}
            width={32}
            className="hidden sm:flex"></Image>

          <span>?</span>
        </button>

        {showInterestForm && (
          <div
            ref={formRef} // Add this line
            className={`fixed top-18 right-6  mt-4 z-30 rounded-lg shadow-lg shadow-zinc-400 flex flex-col w-[300px] gap-4 py-6 px-6 bg-zinc-700 text-white transition-all duration-500 ${
              submittingForm ? "opacity-0" : "opacity-100"
            } max-h-[calc(100vh-5rem)] overflow-y-auto`}>
            <div className="flex flex-row items-center justify-start gap-2">
              <IconMessage2Question stroke={2} className="text-white " />

              <div className="flex flex-row items-center justify-center gap-1">
                <span className="bold">Interested in </span>
                <span className="font-extrabold">clubspace</span>
                <span className="bold">?</span>
              </div>
            </div>

            <p className="ml-2">
              Join the listserv to stay up-to-date with new features and
              launches.
            </p>

            <div className="flex flex-col items-end justify-center w-full gap-4">
              <div className="flex flex-col w-full gap-4">
                {!props.email && (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-start gap-1">
                      <span className="text-xs font-bold text-red-400">
                        *required
                      </span>
                      {invalidEmail && (
                        <span className="text-xs font-bold text-red-400">
                          | Please enter a valid email!
                        </span>
                      )}
                    </div>
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="netid@cornell.edu"
                        onChange={(e) => setFormEmail(e.target.value)}
                        value={formEmail}
                        className="block p-2.5 w-full text-sm text-white bg-zinc-600 rounded-md outline-none"></input>
                    </div>
                  </div>
                )}

                <textarea
                  id="message"
                  maxLength={500}
                  rows={8}
                  onChange={(e) => setFormDescription(e.target.value)}
                  value={formDescription}
                  className="block p-2.5 w-full text-sm text-white bg-zinc-600 rounded-md outline-none"
                  placeholder="comments, feedback, ideas?                         (500 characters max)"></textarea>
                <style>{`
                    textarea::placeholder {
                      font-weight: bold;
                    }
                  `}</style>
                <div className="flex flex-col items-start justify-center gap-2">
                  <div className="flex items-center pl-3">
                    <input
                      id="react-checkbox-list"
                      type="checkbox"
                      defaultChecked={formOfficer}
                      onClick={() => {
                        // currently clicked then unclicked
                        if (formOfficer) {
                          setFormClubInfo(false);
                        }
                        setFormOfficer(!formOfficer);
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="react-checkbox-list"
                      className="w-full ml-2 text-sm font-medium text-white">
                      Are you an officer of any club?
                    </label>
                  </div>
                  {formOfficer && (
                    <div className="flex items-center pl-3">
                      <input
                        id="react-checkbox-list2"
                        type="checkbox"
                        defaultChecked={formClubInfo}
                        onClick={() => setFormClubInfo(!formClubInfo)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="react-checkbox-list2"
                        className="w-full ml-2 text-sm font-medium text-white">
                        Would you like to input club info?
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="px-3 py-2 text-base font-bold bg-red-400 rounded-md"
                onClick={handleInterestForm}>
                <span>Send</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed z-50 flex flex-row justify-center gap-4 bottom-8 right-8">
        <Alert type="success" show={interestFormSuccess} />
        <Alert type="error" show={interestFormError} />
        <Alert type="update" show={interestFormUpdate} />
      </div>
    </>
  );
}
