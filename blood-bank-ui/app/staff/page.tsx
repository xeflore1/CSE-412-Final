'use client';
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StaffPage() {
  const [appointmentID, setAppointmentId] = useState(-1) // containes the value of appointment to be updated
  const [bloodType, setBloodType] = useState("")
  const [bloodSubmit, setBloodSubmit] = useState(0)
  const [username, setUsername] = useState("") 
  const [email, setEmail] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const searchParams = useSearchParams();
  const userId = searchParams.get('data')

  // initialize and display user details
  function UserDetails() {
    useEffect(() => {
      // TODO: utalize the userId to perform a GET call on the Users/Donors table to fill out the following:
      setUsername("defUser")
      setEmail("defEmail")
      setJobTitle("defJob")
  
    }, []);
    return <div>
      <p className="dark:text-gray-300">User Id: {userId}</p>
      <p className="dark:text-gray-300">Username: {username}</p>
      <p className="dark:text-gray-300">Email: {email}</p>
      <p className="dark:text-gray-300">Job Title: {jobTitle}</p>
    </div>
  }

  // Initialize and display appointments
  function ApptList() {
    const [apptList, setAppList] = useState([]);

    useEffect(() => {
      // TODO: a GET call is needed here to fill the following list with all the staff's appointments
      const tempList = [
        {
          appointmentID: 1,
          donorId: 2,
          staffId: 3,
          date: "04/30/26",
          status: "ongoing"
        },
        {
          appointmentID: 2,
          donorId: 3,
          staffId: 4,
          date: "04/29/26",
          status: "completed"
        }
      ];

      setAppList(tempList);
    }, [appointmentID]);

    return (
      <ul>
        {apptList.map((appt) => (
          <li key={appt.appointmentID}>
            ID: {appt.appointmentID},
            Donor ID: {appt.donorId},
            Staff ID: {appt.staffId},
            Date: {appt.date},
            Status: {appt.status}
          </li>
        ))}
      </ul>
    );
  }

  // Appt completer button
  function ApptComp() {
    const handleAttpComp = () =>
    {
      // TODO: perform an UPDATE on Appointments table, given the appointmentID, change the corresponding appointment status to "complete"
      console.log(appointmentID)
    }
    return <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition" onClick={handleAttpComp}>Complete</button>
  }

  // Appt canceller button
  function ApptCancel() {
    const handleAttpCancel = () =>
    {
      // TODO: perform an UPDATE on Appointments table, given the appointmentID, change the corresponding appointment status to "cancelled"
      console.log(appointmentID)
    }
    return <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition" onClick={handleAttpCancel}>Cancel</button>
  }

  // Blood checker button
  function FindBlood() {
    const handleBloodSubmit = () => {
      setBloodSubmit(bloodSubmit + 1)
      console.log(bloodType)
    }
    return <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition" onClick={handleBloodSubmit}>Find</button>
  }

  // Find and display all blood elements after blood type has been submitted
  function BloodList() {
    const [bloodList, setBloodList] = useState([]);

    useEffect(() => {
      // TODO: a GET call is needed here to fill the following list with all the blood entries
      // 'bloodType' containes the blood type that needs to be searched
      const tempList = [
        {
          appointmentID: 1,
          bloodType: "A+",
          volumeMl: 3,
          isAvaible: "True",
          dateDrawn: "4/30/26",
          notes: "nott"
        },
        {
          appointmentID: 2,
          bloodType: "A-",
          volumeMl: 30,
          isAvaible: "False",
          dateDrawn: "4/29/26",
          notes: "nott2"
        }
      ];

      setBloodList(tempList);
    }, [bloodSubmit]);

    return (
      <ul>
        {bloodList.map((blood) => (
          <li key={blood.appointmentID}>
            ID: {blood.appointmentID},
            Blood Type: {blood.bloodType},
            Volume (ML): {blood.volumeMl},
            Avaible: {blood.isAvaible},
            Date Drawn: {blood.dateDrawn},
            Notes: {blood.notes}
          </li>
        ))}
      </ul>
    );
  }

  // Button that redirects to update info page
  function UpdatePageButton() {
    const router = useRouter()
    const handleRedirect = async () => {
      router.push(`/update?id=${userId}&staff=true`)
    }
    return <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition" onClick={handleRedirect}>
          Update Info
        </button>
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Staff page</h1>
      <UserDetails />
      <h1 className="text-2xl font-bold dark:text-white">Appointments</h1>
      <ApptList />
      {/* Appointment Completer */}
      <h1 className="text-2xl font-bold dark:text-white">Appointment Updater: input appointment ID to complete it</h1>
      <div className="flex items-center justify-center gap-4">
        <input className="text-center border-2 border-blue-600 rounded" type="number" placeholder="Appt ID" onChange={(e) => setAppointmentId(e.target.value)}></input>
        <ApptComp />
        <ApptCancel />
      </div>
      {/* Blood Finder */}
      <div className="flex items-center justify-center gap-4">
        <input className="text-center border-2 border-blue-600 rounded" type="text" placeholder="Blood Type" onChange={(e) => setBloodType(e.target.value)}></input>
        <FindBlood />
      </div>
      {/* If blood type has been submitted, render its list */}
      {bloodSubmit > 0 ? 
      <div>
        <BloodList />
      </div> : 
      <div></div>}
      <UpdatePageButton />
      <Link href="/">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Back
        </button>
      </Link>
    </div>
  );
}
