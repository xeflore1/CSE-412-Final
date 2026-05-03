// blood-bank-ui/app/donor

'use client'
import axios from "axios"; 
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from "react";


export default function DonorPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('data')
  const [errorMsg, setErrorMsg] = useState("")
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
    const [appts, setAppts] = useState<{ // defined what appts is here so that there's no warning msgs
      appointmentID: number; donorID: number;
      staffID: number, date: string; status: string;
    }[]>([])
    useEffect(() => {
      // retrieve all appts using appts api
      const fetchAppts = async () => {
        try {
          const res = await axios.get(`http://127.0.0.1:5000/appts/${userId}`);
          setAppts(res.data);
        } catch (err) {
            console.error(err);
        }
      };
      if (userId) fetchAppts();
    }, [userId]);
    return <div className="flex flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Appointments</h1>
      <ul>
        {appts.map((appt) => (
          <li key = {appt.appointmentID}>
             Appointment ID: {appt.appointmentID},
             Donor ID {appt.donorID},
             Staff ID {appt.staffID},
             Date: {appt.date},
             Status {appt.status}
          </li>
        ))}
      </ul>
    </div>
  }

function CreateAppointment() {
  const [apptDate, setApptDate] = useState("");
  const [message, setMessage] = useState(""); 

  const handleApptCreate = async () => {
    if (!apptDate) {
      setMessage("Please select a date.");
      return;
    }
    setMessage("");

    try {
      const payload = {
        donorId: userId,  
        date: apptDate,
      };
      const res = await axios.post("http://127.0.0.1:5000/appts", payload);
      if (res.status === 201) {
        setMessage("Appointment created successfully!");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.error || "Could not create appointment.";
      setMessage(errMsg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Create Appointment</h1>
      <label>
        Enter date of requested appointment:
        <input
          type="date"
          value={apptDate}
          onChange={(e) => setApptDate(e.target.value)}
        />
      </label>
      <button
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        onClick={handleApptCreate}
      >
        Create Appointment
      </button>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </div>
  );
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
      <CreateAppointment />
      <UpdatePageButton />
      <Link href="/">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Back
        </button>
      </Link>
    </div>
  );
}
