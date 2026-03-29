import React from "react";
import AppearanceSettings from "@/features/settings/ui/appearance";
import RegionalSettings from "@/features/settings/ui/regional";
import StorageSettings from "@/features/settings/ui/storage";

type SettingsProps = {
  // Define your props here
};

const Settings: React.FC<SettingsProps> = (props) => {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Content Area */}
        <div className="flex-1 space-y-8">
          <AppearanceSettings />

          <RegionalSettings />

          <StorageSettings />
        </div>
      </div>
    </div>
  );
};

export default Settings;
