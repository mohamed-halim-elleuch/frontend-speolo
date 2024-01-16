// AnotherPage.js
import React from "react";

import { useActiveContent } from "../../apis/ActiveContentContext";
import UserProfile from "./profile/UserProfile";
import Accounts from "./accounts/Accounts";
import NotificationsList from "./notifications/NotificationsList";
import Observations from "./observations/Observations";
import ProfileUpdate from "./settings/ProfileUpdate";
import SensorTypes from "./sensorTypes/SensorTypes";
import Sensors from "./sensors/Sensors";

const Dashboard = () => {
  const { activeContent, setNewActiveContent } = useActiveContent();

  // Use activeContent as needed
  // ...

  return (
    <>
      {activeContent == "profil" && <UserProfile />}
      {activeContent == "settings" && <ProfileUpdate />}
      {activeContent == "accounts" && <Accounts />}
      {activeContent == "observations" && <Observations />}
      {activeContent == "sensorTypes" && <SensorTypes />}
      {activeContent == "notifications" && <NotificationsList />}
      {activeContent == "sensors" && <Sensors />}
    </>
  );
};

export default Dashboard;
