import WhatIsVstep from "@/components/features/home/what-is-vstep";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VSTEP là gì",
  description: "VSTEP là gì",
};

type WhatIsVstepPageProps = {};

const WhatIsVstepPage = (_: WhatIsVstepPageProps) => {
  return <WhatIsVstep />;
};

export default WhatIsVstepPage;
