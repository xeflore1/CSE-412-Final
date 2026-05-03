// blood-bank-ui/app/update
'use client';
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UpdateInfo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('id');
  const isStaff = searchParams.get("staff");
  const userId = userIdParam;
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [dob, setDob] = useState("");
  const [errorMsg, setErrorMsg] = useState("")
  const isStaffFlag = isStaff === "true";

  useEffect(() => {
  if (!userId) return;

  const fetchUser = async () => {
    try {
      if (isStaffFlag) {
        const res = await axios.get(`http://127.0.0.1:5000/staff/${userId}`);
        setUsername(res.data.username);
        setEmail(res.data.email);
        setJobTitle(res.data.jobTitle);
      } else {
        const res = await axios.get(`http://127.0.0.1:5000/donor/${userId}`);
        setUsername(res.data.username);
        setEmail(res.data.email);
        setBloodType(res.data.bloodType);
        setDob(toInputDateFormat(res.data.dob));
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();
}, [userId, isStaffFlag]);

  // function to create dropdown for blood type
  function BloodDropdown() {
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
        <select className="border-2 border-blue-600 rounded" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
          <option value="" disabled>Select Blood Type</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // function to create input for birthday
  function BirthdayInput() {    
    // Restrict to past dates only for DOB
    const today = new Date().toISOString().split("T")[0];
      console.log(dob)
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

  function toInputDateFormat(dateStr: string) {
    if (!dateStr) return "";

    // handles both "YYYY-MM-DD" and ISO strings
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  
  // function for create user submission
  function Submit() {
    const handleSubmit = async () => {
      setErrorMsg("");

      try {
        if (isStaffFlag) {
          const payload = {
            email,
            username,
            jobTitle
          };

          await axios.put(`http://127.0.0.1:5000/staff/${userId}`, payload);

        } else {
          const payload = {
            email,
            username,
            bloodType,
            dob
          };

          await axios.put(`http://127.0.0.1:5000/donor/${userId}`, payload);
        }

        router.push("/");

      } catch (err: any) {
        const msg = err.response?.data?.error || "Update failed";
        setErrorMsg(msg);
      }
  };
    return <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition" onClick={handleSubmit}>
            Submit
          </button>
  }

  // delete account button
  function DeleteUser() {
    const handleSubmit = async () => {
      setErrorMsg("");

      try {
        await axios.delete(`http://127.0.0.1:5000/user/${userId}`);
        router.push("/");
      } catch (err: any) {
        const msg = err.response?.data?.error || "delete failed";
        setErrorMsg(msg);
      }
    };

    return (
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        onClick={handleSubmit}
      >
        Delete Account
      </button>
    );
  }

  // renders update form
  function UpdateStaff() {

    return <div className="flex flex-col items-center justify-center gap-3">
        <h1 className="text-2xl font-bold dark:text-white">Update User</h1>
          <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}></input>
          <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}></input>
          <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}></input>
          {isStaffFlag ? 
          <div>
            <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)}></input>
          </div> :
          <div className="flex flex-col items-center justify-center gap-3">
            <BloodDropdown />
            <BirthdayInput />
          </div>}
          <Submit />
      </div>
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <UpdateStaff />
      <DeleteUser />
      <Link href="/">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Back
        </button>
      </Link>
      <p className="text-red-500">{errorMsg}</p>
    </div>
  );
}
