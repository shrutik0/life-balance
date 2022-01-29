import React from "react";
import { PropertyDetailsSectionStyle } from "./booking.style";
import DetailsSection from "./DetailsSection";
import ImageSection from "./ImageSection";

function PropertyDetailsSection(props) {
  return (
    <PropertyDetailsSectionStyle>
      <ImageSection />
      <DetailsSection />
    </PropertyDetailsSectionStyle>
  );
}

export default PropertyDetailsSection;