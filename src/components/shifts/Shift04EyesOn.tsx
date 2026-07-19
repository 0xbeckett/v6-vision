import { ShiftSection } from "@/components/site/ShiftSection";
import { SHIFTS } from "@/content/shifts";

/* shift 04. own file so branch #45.2 can pass a `demo` node here without
   touching the other four sections. */
export function Shift04EyesOn() {
  return <ShiftSection shift={SHIFTS[3]} />;
}
