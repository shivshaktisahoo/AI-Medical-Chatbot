import { useEffect, useState } from "react";

export type DoctorGender = "female" | "male";

export function useDoctorVoice() {
  const [gender, setGender] = useState<DoctorGender>(() => {
    try {
      return localStorage.getItem("doctorVoice") === "male" ? "male" : "female";
    } catch {
      return "female";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("doctorVoice", gender);
    } catch {
      /* private browsing / storage disabled — non-critical */
    }
  }, [gender]);

  return { gender, setGender };
}
