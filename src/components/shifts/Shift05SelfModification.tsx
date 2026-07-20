import { ShiftSection } from "@/components/site/ShiftSection";
import { SelfModification } from "@/components/artifacts/SelfModification";
import { SHIFTS } from "@/content/shifts";

/* shift 05. push a change through propose → validate → deploy, watch production
   turn, and roll it back — with the veto in your hand the whole time. */
export function Shift05SelfModification() {
  return <ShiftSection shift={SHIFTS[4]} demo={<SelfModification />} />;
}
