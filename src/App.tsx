import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { ThroughLine } from "@/components/site/ThroughLine";
import { Footer } from "@/components/site/Footer";
import { Shift01ContinuousSelf } from "@/components/shifts/Shift01ContinuousSelf";
import { Shift02Initiative } from "@/components/shifts/Shift02Initiative";
import { Shift03StandingTeam } from "@/components/shifts/Shift03StandingTeam";
import { Shift04EyesOn } from "@/components/shifts/Shift04EyesOn";
import { Shift05SelfModification } from "@/components/shifts/Shift05SelfModification";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Shift01ContinuousSelf />
        <Shift02Initiative />
        <Shift03StandingTeam />
        <Shift04EyesOn />
        <Shift05SelfModification />
        <ThroughLine />
      </main>
      <Footer />
    </>
  );
}
