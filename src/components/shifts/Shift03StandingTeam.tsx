import { ShiftSection } from "@/components/site/ShiftSection";
import { StandingTeam } from "@/components/artifacts/StandingTeam";
import { SHIFTS } from "@/content/shifts";

/* shift 03. re-run the same ticket and watch the apprentice get cheaper and
   faster while a cold-started worker never moves. */
export function Shift03StandingTeam() {
  return <ShiftSection shift={SHIFTS[2]} demo={<StandingTeam />} />;
}
