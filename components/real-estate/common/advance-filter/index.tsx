// components/common/advance-filter/index.tsx
"use client";

import Select from "react-select";
import PriceRange from "./PriceRange";
import Bedroom from "./Bedroom";
import Bathroom from "./Bathroom";
import Amenities from "./Amenities";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define types for options
interface OptionType {
  value: string;
  label: string;
}

interface CustomStylesProps {
  isFocused: boolean;
  isSelected: boolean;
  isHovered: boolean;
}

const AdvanceFilterModal: React.FC = () => {
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setShowSelect(true);
  }, []);

  const catOptions: OptionType[] = [
    { value: "Banking", label: "Apartments" },
    { value: "Bungalow", label: "Bungalow" },
    { value: "Houses", label: "Houses" },
    { value: "Loft", label: "Loft" },
    { value: "Office", label: "Office" },
    { value: "Townhome", label: "Townhome" },
    { value: "Villa", label: "Villa" },
  ];

  const locationOptions: OptionType[] = [
    { value: "All Cities", label: "All Cities" },
    { value: "California", label: "California" },
    { value: "Los Angeles", label: "Los Angeles" },
    { value: "New Jersey", label: "New Jersey" },
    { value: "New York", label: "New York" },
    { value: "San Diego", label: "San Diego" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "Texas", label: "Texas" },
  ];

  const customStyles = {
    option: (styles: any, { isFocused, isSelected, isHovered }: CustomStylesProps) => {
      return {
        ...styles,
        backgroundColor: isSelected
          ? "#eb6753"
          : isHovered
          ? "#eb675312"
          : isFocused
          ? "#eb675312"
          : undefined,
        color: isSelected ? "#ffffff" : "#181a20",
        cursor: "pointer",
        fontSize: "14px",
        padding: "10px 15px",
        transition: "all 0.3s ease",
      };
    },
    control: (styles: any) => ({
      ...styles,
      border: "1px solid #dddddd",
      borderRadius: "12px",
      height: "50px",
      minHeight: "50px",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #dddddd",
      },
    }),
    menu: (styles: any) => ({
      ...styles,
      borderRadius: "12px",
      boxShadow: "0px 10px 40px rgba(24, 26, 32, 0.05)",
      padding: "10px 0",
      zIndex: 9999,
    }),
  };

  const handleSearch = (): void => {
    router.push("/map-v1");
  };

  return (
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header pl30 pr30">
          <h5 className="modal-title" id="exampleModalLabel">
            More Filter
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>

        {/* Modal Body */}
        <div className="modal-body pb-0">
          {/* Price Range */}
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper">
                <h6 className="list-title mb20">Price Range</h6>
                <div className="range-slider-style modal-version">
                  <PriceRange />
                </div>
              </div>
            </div>
          </div>

          {/* Type and Property ID */}
          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Type</h6>
                <div className="form-style2 input-group">
                  {showSelect && (
                    <Select<OptionType>
                      defaultValue={catOptions[1]}
                      name="type"
                      options={catOptions}
                      styles={customStyles}
                      className="select-custom"
                      classNamePrefix="select"
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Property ID</h6>
                <div className="form-style2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="RT04949213"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bedrooms and Bathrooms */}
          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bedrooms</h6>
                <div className="d-flex">
                  <Bedroom />
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bathrooms</h6>
                <div className="d-flex">
                  <Bathroom />
                </div>
              </div>
            </div>
          </div>

          {/* Location and Square Feet */}
          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Location</h6>
                <div className="form-style2 input-group">
                  {showSelect && (
                    <Select<OptionType>
                      defaultValue={locationOptions[0]}
                      name="location"
                      styles={customStyles}
                      options={locationOptions}
                      className="select-custom"
                      classNamePrefix="select"
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Square Feet</h6>
                <div className="space-area">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="form-style1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Min."
                      />
                    </div>
                    <span className="dark-color">-</span>
                    <div className="form-style1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper mb0">
                <h6 className="list-title mb10">Amenities</h6>
              </div>
            </div>
            <Amenities />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer justify-content-between">
          <button className="reset-button" type="button">
            <span className="flaticon-turn-back" />
            <u>Reset all filters</u>
          </button>
          <div className="btn-area">
            <button
              data-bs-dismiss="modal"
              type="submit"
              className="ud-btn btn-thm"
              onClick={handleSearch}
            >
              <span className="flaticon-search align-text-top pr10" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvanceFilterModal;