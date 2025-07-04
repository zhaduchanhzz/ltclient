// Example of how to add structured data to the home page
// This file demonstrates the implementation - integrate this into your actual home page component

import StructuredData, {
  organizationSchema,
} from "@/components/common/StructuredData";

export default function HomePageWithStructuredData() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      {/* Your existing home page content */}
    </>
  );
}