'use client';
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UpdateInfo() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id')
  const isStaff = searchParams.get('staff')
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [dob, setDob] = useState("");
  const [errorMsg, setErrorMsg] = useState("")

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
  
  // function for create user submission
  function Submit() {
    const router = useRouter()
    const handleSubmit = () => {
      // TODO: do UPDATE request to update user at userId with the following params
      if (isStaff === "true") // user is staff
      {
        // email, username, password, jobTitle
      }
      else { // user is donor
        // email, username, password, bloodType, dob
      }
      const responseCode = 200
      if (responseCode === 200)
      {
        console.log("Username: " + username)
        console.log("Pass: " + password)
        console.log("email: " + email)
        console.log("blood: " + bloodType)
        console.log("birthday: " + dob)
        console.log("job: " + jobTitle)
        router.push('/')
      }
      else {
        setErrorMsg("Wrong, do it again")
      }
    }
    return <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition" onClick={handleSubmit}>
            Submit
          </button>
  }

  // renders update form
  function UpdateStaff() {

    return <div className="flex flex-col items-center justify-center gap-3">
        <h1 className="text-2xl font-bold dark:text-white">Update User</h1>
          <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Email" onChange={e => setEmail(e.target.value)}></input>
          <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Username" onChange={e => setUsername(e.target.value)}></input>
          <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Password" onChange={e => setPassword(e.target.value)}></input>
          {isStaff === "true" ? 
          <div>
            <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Job Title" onChange={e => setJobTitle(e.target.value)}></input>
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
      <Link href="/">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Back
        </button>
      </Link>
      <p className="text-red-500">{errorMsg}</p>
    </div>
  );
}
