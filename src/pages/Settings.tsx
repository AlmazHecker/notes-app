import React from "react";
import AppearanceSettings from "@/features/Settings/ui/AppearanceSettings";
import RegionalSettings from "@/features/Settings/ui/RegionalSettings";
import StorageSettings from "@/features/Settings/ui/StorageSettings";

type SettingsProps = {
  // Define your props here
};

const Settings: React.FC<SettingsProps> = (props) => {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
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
