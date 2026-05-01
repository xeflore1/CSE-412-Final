'use client'
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";


export default function DonorPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('data')
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [dob, setDob] = useState("")

  function UserDetails() {
    useEffect(() => {
      // TODO: utalize userId to perform a GET call on the Users/Donors table to fill out the following:
      setUsername("defUser")
      setEmail("defEmail")
      setBloodType("defBlood")
      setDob("defDob")
  
    }, []);
    return <div>
      <p className="dark:text-gray-300">User Id: {userId}</p>
      <p className="dark:text-gray-300">Username: {username}</p>
      <p className="dark:text-gray-300">Email: {email}</p>
      <p className="dark:text-gray-300">Blood Type: {bloodType}</p>
      <p className="dark:text-gray-300">Date Of Birth: {dob}</p>
    </div>
  }

  // function to retrieve and display appointments
  function ApptList() {
    const [appts, setAppts] = useState([])
    useEffect(() => {
      // TODO: similarly, perform a GET call to retrieve all appointments the user has, store the results in the following list
      setAppts([
        { appointmentID: 1, donorId: 2, staffId: 3, date: "04/30/25", status: "ongoing"},
        { appointmentID: 2, donorId: 3, staffId: 4, date: "04/29/26", status: "completed"}
      ])
    }, []);
    return <div className="flex flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Appointments</h1>
      <ul>
        {appts.map((appt) => (
          <li key = {appt.appointmentID}>
            ID: {appt.appointmentID},
             Donor ID {appt.donorId},
             Staff ID {appt.staffId},
             Date: {appt.date},
             Status {appt.status}
          </li>
        ))}
      </ul>
    </div>
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Donor Page</h1>
      <UserDetails />
      <ApptList />
      <Link href="/update">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Update Info
        </button>
      </Link>
      <Link href="/">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Back
        </button>
      </Link>
    </div>
  );
}
