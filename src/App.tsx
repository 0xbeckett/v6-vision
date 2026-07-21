import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { InvocationContrast } from "@/components/site/InvocationContrast";
import { Pillars } from "@/components/site/Pillars";
import { AutonomyLoop } from "@/components/site/AutonomyLoop";
import { Machinery } from "@/components/site/Machinery";
import { Pricing } from "@/components/site/Pricing";
import { ThroughLine } from "@/components/site/ThroughLine";
import { Footer } from "@/components/site/Footer";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <InvocationContrast />
        <Pillars />
        <AutonomyLoop />
        <Machinery />
        <Pricing />
        <ThroughLine />
      </main>
      <Footer />
    </>
  );
}
