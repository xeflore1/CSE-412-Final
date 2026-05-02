'use client'
import axios from "axios"; 
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
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
      // Call the get donor info api
      const fetchUser = async () => {
        try {
          const res = await axios.get(`http://127.0.0.1:5000/donor/${userId}`);
          
          setUsername(res.data.username);
          setEmail(res.data.email);
          setBloodType(res.data.bloodType);
          setDob(res.data.dob);

        } catch (err) {
          console.error(err);
        }
      };
      if (userId) fetchUser();
    }, [userId]);
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

  // Button that redirects to update info page
  function UpdatePageButton() {
    const router = useRouter()
    const handleRedirect = async () => {
      router.push(`/update?id=${userId}&staff=false`)
    }
    return <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition" onClick={handleRedirect}>
          Update Info
        </button>
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Donor Page</h1>
      <UserDetails />
      <ApptList />
      <UpdatePageButton />
      <Link href="/">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Back
        </button>
      </Link>
    </div>
  );
}
