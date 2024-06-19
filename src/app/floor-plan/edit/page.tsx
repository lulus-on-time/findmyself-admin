"use-client";

import CustomLayout from "@/components/layout/CustomLayout";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const EditFloorPlanPage = () => {
  const EditFloorPlanPageNoSsr = useMemo(
    () =>
      dynamic(
        () => import("@/components/client-rendered-pages/EditFloorPlanPage"),
        { ssr: false },
      ),
    [],
  );
  return (
    <CustomLayout>
      <EditFloorPlanPageNoSsr />
    </CustomLayout>
  );
};

export default EditFloorPlanPage;
