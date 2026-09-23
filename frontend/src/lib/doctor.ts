import type { DoctorGender } from "../hooks/useDoctorVoice";

export function doctorName(gender: DoctorGender) {
  return gender === "female" ? "Dr. Aria" : "Dr. Andrew";
}
