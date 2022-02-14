import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Link, useNavigate, useParams } from "react-router-dom";
import tippy, { createSingleton } from "tippy.js";
import { string } from "yup";
import Carousel from "../components/molecules/Carousel";
import { Collapsible } from "../components/molecules/CustomCollapsible";
import Floor from "../components/molecules/Floor";
import HoverInfo from "../components/molecules/HoverInfo";
import Tower from "../components/molecules/Tower";
import CarouselPageDetails from "../components/molecules/CarouselPageDetails";
import { FLOORS, TOWER_NAMES_LIST } from "../data";
import {
  getFlatInfo,
  getFormalNameFromNumber,
  getFormalUnitType,
  getFormatedMinMaxUnitSize,
  rupeeIndian,
} from "../functions/helpers";
import { getAllFlatsInFloor } from "../functions/inventory";
import { TowersPageStyle } from "./pages.style";
import Navigator from "../components/atoms/Navigator";
import { useShowDetails, useViewport } from "../contexts/AppContext";
import OnClickInfo from "../components/molecules/OnClickInfo";
import Flat from "../components/molecules/Flat";

const HomeButton = () => (
  <Link to={"/"}>
    <div className="home-btn center">
      <img src={`${process.env.PUBLIC_URL}/icons/home.svg`} />
    </div>
  </Link>
);

function Flats() {
  const { showDetails } = useShowDetails();
  const { floorId, towerId, flatNumber } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useViewport();
  const flats = getAllFlatsInFloor(towerId, floorId);
  const FLAT_NAMES = flats.map((flat) =>
    parseInt(flat["FlatNumber"][flat["FlatNumber"].length - 1])
  );

  console.log(FLAT_NAMES);

  const [currentFlatIndex, setCurrentFlatIndex] = useState(
    flats.findIndex((flat) => flat["FlatNumber"] == flatNumber)
  );
  console.log(currentFlatIndex);

  return (
    <TowersPageStyle>
      <HomeButton />

      <Collapsible collapsible={true} open={showDetails}>
        <CarouselPageDetails
          style={{ width: "500px" }}
          title={flats[currentFlatIndex]["FlatNumber"]}
          Header={
            <Header
              FLAT_NAMES={flats.map((flat) => flat["FlatNumber"])}
              onFlatChange={(flat) => setCurrentFlatIndex(flat.value)}
              currentFlatIndex={currentFlatIndex}
              currentFloor={floorId}
              currentTower={towerId}
              onFloorChangge={(floor) =>
                navigate(`/tower/${towerId}/floor/${floor.value}`)
              }
              onTowerChange={(tower) => navigate(`/tower/${tower.value}`)}
            />
          }
          highlights={[
            <span className={flats[currentFlatIndex]["UnitStatus"]}>
              {`${flats[currentFlatIndex]["UnitStatus"]}`}{" "}
            </span>,
            `${flats[currentFlatIndex]["UnitType"]}`,
          ]}
          features={[
            {
              key: "DIRECTION",
              value: `${flats[currentFlatIndex]["Direction"].replace(
                "Facing",
                ""
              )}`,
            },
            {
              key: "Total Carpet Area",
              value: `${parseInt(flats[currentFlatIndex]["CarpetArea"])} Sq.ft`,
            },
            {
              key: "SBU Area",
              value: `${parseInt(flats[currentFlatIndex]["Area"])} Sq.ft`,
            },
            {
              key: "Total Cost",
              value: (
                <>
                  <div>{` ₹ ${rupeeIndian.format(
                    parseInt(flats[currentFlatIndex]["TotalCost"])
                  )}`}</div>
                </>
              ),
            },
            {
              key: "Booking Amount",
              value: "20,000 ₹",
            },
          ].slice(
            0,
            flats[currentFlatIndex]["UnitStatus"] == "Available" ? 4 : 2
          )}
          buttons={
            flats[currentFlatIndex]["UnitStatus"] == "Available"
              ? [
                  {
                    text: "Book Now",
                    onClick: () =>
                      navigate(
                        `/booking/${flats[currentFlatIndex]["PropertyId"]}`
                      ),
                  },
                  {
                    text: "Virtual Tour",
                    onClick: () => alert("virtual tour to start.."),
                  },
                ]
              : []
          }
        />
      </Collapsible>
      <Carousel
        titleList={FLAT_NAMES}
        onChange={(changedItemIndex) => {
          setCurrentFlatIndex(changedItemIndex);
        }}
        currentItemIndex={currentFlatIndex}
      >
        {flats.map((flat, index) => (
          <Flat
            flatNumber={flat["FlatNumber"]}
            flatIndex={index}
            towerId={towerId}
          />
        ))}
      </Carousel>
    </TowersPageStyle>
  );
}

export default Flats;

const Header = ({
  FLAT_NAMES,
  currentTower,
  currentFloor,
  currentFlatIndex,
  onTowerChange,
  onFloorChangge,
  onFlatChange,
}) => (
  <>
    <Navigator
      className={"flat-navigator"}
      defaultOption={currentTower}
      title={"Tower"}
      icon={"building"}
      options={TOWER_NAMES_LIST.map((tower) => ({
        label: tower,
        value: tower,
      }))}
      onChange={onTowerChange}
    />
    <Navigator
      className={"flat-navigator"}
      defaultOption={getFormalNameFromNumber(currentFloor)}
      title={"Floor"}
      icon={"layers"}
      options={FLOORS.map((floor) => ({
        label: getFormalNameFromNumber(floor),
        value: floor,
      }))}
      onChange={onFloorChangge}
    />
    <Navigator
      className={"flat-navigator"}
      defaultOption={FLAT_NAMES[currentFlatIndex]}
      title={"Flat"}
      icon={"layers"}
      options={FLAT_NAMES.map((flat, index) => ({
        label: flat,
        value: index,
      }))}
      onChange={onFlatChange}
    />
  </>
);
