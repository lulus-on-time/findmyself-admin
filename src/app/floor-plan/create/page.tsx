"use-client";
import CustomLayout from "@/components/layout/CustomLayout";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const CreateFloorPlanPage = () => {
  const CreateFloorPlanPageNoSsr = useMemo(
    () =>
      dynamic(
        () => import("@/components/client-rendered-pages/CreateFloorPlanPage"),
        { ssr: false },
      ),
    [],
  );
  return (
    <CustomLayout>
      <CreateFloorPlanPageNoSsr />
    </CustomLayout>
  );
};

export default CreateFloorPlanPage;
