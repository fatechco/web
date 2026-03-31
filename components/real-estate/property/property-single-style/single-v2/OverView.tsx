import type { Property } from "@/types/property";

interface OverViewProps {
  property: Property;
}

const OverView = ({property} : OverViewProps) => {
  const overviewData = [
    {
      icon: "flaticon-bed",
      label: "Bedroom",
      value: property.bedrooms,
    },
    {
      icon: "flaticon-shower",
      label: "Bath",
      value: property.bathrooms,
    },
    {
      icon: "flaticon-event",
      label: "Year Built",
      value: property.year_built,
    },
    {
      icon: "flaticon-garage",
      label: "Garage",
      value: property.garages,
    },
    {
      icon: "flaticon-expand",
      label: "Sqft",
      value: property.area_formatted,
    },
    {
      icon: "flaticon-home-1",
      label: "Property Type",
      value: property.category?.name,
    },
  ]  
  return (
    <>
      {overviewData.map((item, index) => (
        <div key={index} className="col-sm-6 col-md-4 col-xl-2">
          <div className="overview-element mb30 d-flex align-items-center">
            <span className={`icon ${item.icon}`} />
            <div className="ml15">
              <h6 className="mb-0">{item.label}</h6>
              <p className="text mb-0 fz15">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OverView;
