// blood-bank-ui/app/staff/blood/create/page.tsx
'use client';
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CreateBloodUnit() {
  const [appointmentId, setAppointmentId] = useState("");
  const [volumeMl, setVolumeMl] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!appointmentId || !volumeMl) {
      setErrorMsg("Please fill in Appointment ID and Volume.");
      return;
    }

    const payload = {
      appointmentId: Number(appointmentId),
      volumeMl: Number(volumeMl),
      notes: notes || undefined,
    };

    try {
      const res = await axios.post("http://127.0.0.1:5000/bloodunits", payload);
      if (res.status === 201) {
        setSuccessMsg(`Blood pack created! Unit ID: ${res.data.unitId}, Blood Type: ${res.data.bloodType}`);
        // Clear form
        setAppointmentId("");
        setVolumeMl("");
        setNotes("");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Creation failed.");
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Create Blood Pack</h1>
      <div className="flex flex-col items-center justify-center gap-3">
        <input
          type="number"
          className="text-center border-2 border-blue-600 rounded"
          placeholder="Appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
        />
        <input
          type="number"
          className="text-center border-2 border-blue-600 rounded"
          placeholder="Volume (ml)"
          value={volumeMl}
          onChange={(e) => setVolumeMl(e.target.value)}
        />
        <textarea
          className="text-center border-2 border-blue-600 rounded"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          onClick={handleCreate}
        >
          Create Blood Pack
        </button>
      </div>
      <Link href="/">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Back to Staff Dashboard
        </button>
      </Link>
    </div>
  );
}