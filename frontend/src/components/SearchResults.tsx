import { useContext } from "react";
import { MasterContext } from "../context";
import MasterCard from "./MasterCard";

import type { Master } from "../schema/master/master.type";

type SearchResultsProps = {
  masters: Master[];
  city: string;
  professionCategory: string;
  setShowModal: (show: string) => void;
};

export default function SearchResults({
  masters,
  city,
  professionCategory,
  setShowModal,
}: SearchResultsProps) {
  const {
    state: { professions, countryID },
  } = useContext(MasterContext);

  const availableProfessionIDs = professions
    .filter((p) =>
      !professionCategory ? true : p.categoryID === professionCategory
    )
    .map((p) => p.id);

  const filteredMasters = masters.filter(
    (master) =>
      master.countryID === countryID &&
      master.locationID.includes(city) &&
      availableProfessionIDs.includes(master.professionID)
  );

  return (
    <>
      <div className="search-results-header">
        <h2>Знайдено майстрів:</h2>
        <span className="found-amount">{filteredMasters.length}</span>
      </div>
      {filteredMasters.map((master) => (
        <MasterCard
          key={master._id}
          master={master}
          setShowModal={setShowModal}
        />
      ))}
    </>
  );
}
