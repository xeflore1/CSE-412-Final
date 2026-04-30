'use client'
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DonorPage from "../donor/page";

export default function CreateUser() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isStaff, setIsStaff] = useState(false)
  const [bloodType, setBloodType] = useState("");
  const [dob, setDob] = useState('');
  const [jobTitle, setJobTitle] = useState("")
  const [errorMsg, setErrorMsg] = useState("")


  
  function Checkbox() {
    const handleCheckbox = () => {
      setIsStaff(!isStaff)
    }    
    return <div className="flex p-2 gap-1">
      <label>Admin?</label>
      <input className="size-5" type="checkbox" checked={isStaff} onChange={handleCheckbox}></input>
    </div>
  }

  function Submit() {
    const router = useRouter()
    const handleSubmit = () => {
      // TODO: create new user with the following params
      // email
      // username
      // password
      // isStaff: 
      //   true -> jobTitle, 
      //   false -> bloodType, dob
      const responseCode = 200
      if (responseCode === 200)
      {
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

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <div className="flex flex-col items-center justify-center gap-3">
        <h1 className="text-2xl font-bold dark:text-white">Create User</h1>
          <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Email" onChange={e => setEmail(e.target.value)}></input>
          <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Username" onChange={e => setUsername(e.target.value)}></input>
          <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Password" onChange={e => setPassword(e.target.value)}></input>
          {isStaff === false ? 
          <div className="flex flex-col items-center justify-center gap-3">
            <BloodDropdown />
            <BirthdayInput />
          </div> : 
          <div>
            <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Job Title" onChange={e => setJobTitle(e.target.value)}></input>
          </div>}
          <Submit />
      </div>
      <div className="flex p-2">
        <Checkbox />
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
