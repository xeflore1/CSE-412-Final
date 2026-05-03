// blood-bank-ui/app/create

'use client'
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// ---------------- Subcomponents (defined OUTSIDE) ----------------

function Checkbox({ isStaff, setIsStaff }: { isStaff: boolean; setIsStaff: (v: boolean) => void }) {
  return (
    <div className="flex p-2 gap-1">
      <label>Admin?</label>
      <input
        className="size-5"
        type="checkbox"
        checked={isStaff}
        onChange={() => setIsStaff(!isStaff)}
      />
    </div>
  );
}

function BloodDropdown({ bloodType, setBloodType }: { bloodType: string; setBloodType: (v: string) => void }) {
  const options = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ];

  return (
    <div>
      <select
        className="border-2 border-blue-600 rounded"
        value={bloodType}
        onChange={(e) => setBloodType(e.target.value)}
      >
        <option value="" disabled>
          Select Blood Type
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function BirthdayInput({ dob, setDob }: { dob: string; setDob: (v: string) => void }) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <label>
      Enter your birthday:
      <input
        type="date"
        value={dob}
        max={today}
        onChange={(e) => setDob(e.target.value)}
      />
    </label>
  );
}

function SubmitButton({
  isStaff,
  email,
  username,
  password,
  bloodType,
  dob,
  jobTitle,
  setErrorMsg,
}: {
  isStaff: boolean;
  email: string;
  username: string;
  password: string;
  bloodType: string;
  dob: string;
  jobTitle: string;
  setErrorMsg: (msg: string) => void;
}) {
  const router = useRouter();

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!email || !username || !password) {
      setErrorMsg("Email, username, and password are required.");
      return;
    }
    if (!isStaff) {
      if (!bloodType || !dob) {
        setErrorMsg("Blood type and date of birth are required for donors.");
        return;
      }
    } else {
      if (!jobTitle) {
        setErrorMsg("Job title is required for staff.");
        return;
      }
    }

    const payload: any = {
      email,
      username,
      password,
      isStaff,
    };
    if (isStaff) {
      payload.jobTitle = jobTitle;
    } else {
      payload.bloodType = bloodType;
      payload.dob = dob;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/register", payload);
      if (response.status === 201) {
        router.push("/");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Registration failed";
      setErrorMsg(message);
    }
  };

  return (
    <button
      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
      onClick={handleSubmit}
    >
      Submit
    </button>
  );
}

// ---------------- Main component ----------------

export default function CreateUser() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [bloodType, setBloodType] = useState("");
  const [dob, setDob] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <div className="flex flex-col items-center justify-center gap-3">
        <h1 className="text-2xl font-bold dark:text-white">Create User</h1>

        <input
          type="text"
          className="text-center border-2 border-blue-600 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          className="text-center border-2 border-blue-600 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          className="text-center border-2 border-blue-600 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isStaff === false ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <BloodDropdown bloodType={bloodType} setBloodType={setBloodType} />
            <BirthdayInput dob={dob} setDob={setDob} />
          </div>
        ) : (
          <div>
            <input
              type="text"
              className="text-center border-2 border-blue-600 rounded"
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
        )}

        <SubmitButton
          isStaff={isStaff}
          email={email}
          username={username}
          password={password}
          bloodType={bloodType}
          dob={dob}
          jobTitle={jobTitle}
          setErrorMsg={setErrorMsg}
        />
      </div>

      <div className="flex p-2">
        <Checkbox isStaff={isStaff} setIsStaff={setIsStaff} />
        <Link href="/">
          <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
            Back
          </button>
        </Link>
      </div>

      <p className="text-red-500">{errorMsg}</p>
    </div>
  );
}