import React from "react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import ExpertCallBanner from "../../components/common/ExpertCallBanner";
import GuidanceRegistrationForm from "../../components/ConsultGuidance/GuidanceRegistrationForm";
import StepsSection from "../../components/ConsultGuidance/StepsSection";

const ConsultGuidance = () => {
  return (
    <React.Fragment>
      <UserNavbar />

      <ExpertCallBanner />
      <StepsSection />
      <GuidanceRegistrationForm />

      <AllUserFooter />
    </React.Fragment>
  );
};

export default ConsultGuidance;
