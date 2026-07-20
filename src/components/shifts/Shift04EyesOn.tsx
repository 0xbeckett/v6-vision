import { ShiftSection } from "@/components/site/ShiftSection";
import { EyesOn } from "@/components/artifacts/EyesOn";
import { SHIFTS } from "@/content/shifts";

/* shift 04. run the loop and watch it close: deploy, observe, catch its own
   regression, loop back, and come up healthy. */
export function Shift04EyesOn() {
  return <ShiftSection shift={SHIFTS[3]} demo={<EyesOn />} />;
}
