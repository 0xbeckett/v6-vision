import { ShiftSection } from "@/components/site/ShiftSection";
import { ContinuousSelf } from "@/components/artifacts/ContinuousSelf";
import { SHIFTS } from "@/content/shifts";

/* shift 01. the demo makes the claim tangible: scrub the timeline and watch a
   rotating window drop history a continuous self keeps. */
export function Shift01ContinuousSelf() {
  return <ShiftSection shift={SHIFTS[0]} demo={<ContinuousSelf />} />;
}
