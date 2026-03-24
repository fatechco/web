"use client";

import React from "react";
import Select from "react-select";
import { useCountries, useProvinces, useDistricts, useWards } from "@/hook/use-location";

interface LocationSelectorProps {
  countryId?: number;
  provinceId?: number;
  districtId?: number;
  wardId?: number;
  onChange: (values: {
    country_id?: number;
    province_id?: number;
    district_id?: number;
    ward_id?: number;
  }) => void;
  showWard?: boolean;
  required?: boolean;
  labelClassName?: string;
}

const LocationSelector = ({
  countryId,
  provinceId,
  districtId,
  wardId,
  onChange,
  showWard = true,
  required = false,
  labelClassName = "heading-color ff-heading fw600 mb10",
}: LocationSelectorProps) => {
  // Fetch data - hooks now return arrays directly
  const { countries, isLoading: loadingCountries } = useCountries();
  const { provinces, isLoading: loadingProvinces } = useProvinces(countryId);
  const { districts, isLoading: loadingDistricts } = useDistricts(provinceId);
  const { wards, isLoading: loadingWards } = useWards(districtId);

  // Options for selects - ensure arrays exist
  const countryOptions = Array.isArray(countries) 
    ? countries.map(c => ({ value: c.id, label: c.name })) 
    : [];
  const provinceOptions = Array.isArray(provinces) 
    ? provinces.map(p => ({ value: p.id, label: p.name })) 
    : [];
  const districtOptions = Array.isArray(districts) 
    ? districts.map(d => ({ value: d.id, label: d.name })) 
    : [];
  const wardOptions = Array.isArray(wards) 
    ? wards.map(w => ({ value: w.id, label: w.name })) 
    : [];

  // Find selected options
  const selectedCountry = countryOptions.find(opt => opt.value === countryId);
  const selectedProvince = provinceOptions.find(opt => opt.value === provinceId);
  const selectedDistrict = districtOptions.find(opt => opt.value === districtId);
  const selectedWard = wardOptions.find(opt => opt.value === wardId);

  // Handle country change
  const handleCountryChange = (option: any) => {
    onChange({
      country_id: option?.value,
      province_id: undefined,
      district_id: undefined,
      ward_id: undefined,
    });
  };

  // Handle province change
  const handleProvinceChange = (option: any) => {
    onChange({
      country_id: countryId,
      province_id: option?.value,
      district_id: undefined,
      ward_id: undefined,
    });
  };

  // Handle district change
  const handleDistrictChange = (option: any) => {
    onChange({
    country_id: countryId,
      province_id: provinceId,
      district_id: option?.value,
      ward_id: undefined,
    });
  };

  // Handle ward change
  const handleWardChange = (option: any) => {
    onChange({
      country_id: countryId,
      province_id: provinceId,
      district_id: districtId,
      ward_id: option?.value,
    });
  };

  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      borderRadius: "12px",
      borderColor: "#e5e7eb",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#eb6753",
      },
    }),
    option: (styles: any, { isSelected, isFocused }: any) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#eb6753"
        : isFocused
        ? "#eb675312"
        : undefined,
      color: isSelected ? "#fff" : "#1f2937",
      cursor: "pointer",
    }),
    placeholder: (styles: any) => ({
      ...styles,
      color: "#9ca3af",
    }),
  };

  return (
    <div className="row">
      {/* Country Select */}
      <div className="col-sm-6 col-xl-3">
        <div className="mb20">
          <label className={labelClassName}>
            Country {required && <span className="text-danger">*</span>}
          </label>
          <Select
            options={countryOptions}
            value={selectedCountry}
            onChange={handleCountryChange}
            isLoading={loadingCountries}
            placeholder="Select country"
            styles={customStyles}
            className="select-custom"
            classNamePrefix="select"
            isClearable
            noOptionsMessage={() => loadingCountries ? "Loading..." : "No countries found"}
          />
        </div>
      </div>

      {/* Province/State Select */}
      <div className="col-sm-6 col-xl-3">
        <div className="mb20">
          <label className={labelClassName}>Province / State</label>
          <Select
            options={provinceOptions}
            value={selectedProvince}
            onChange={handleProvinceChange}
            isLoading={loadingProvinces}
            placeholder="Select province"
            styles={customStyles}
            className="select-custom"
            classNamePrefix="select"
            isDisabled={!countryId}
            isClearable
            noOptionsMessage={() => {
              if (!countryId) return "Select country first";
              if (loadingProvinces) return "Loading...";
              return "No provinces found";
            }}
          />
          {!countryId && (
            <small className="text-muted">Please select country first</small>
          )}
        </div>
      </div>

      {/* District Select */}
      <div className="col-sm-6 col-xl-3">
        <div className="mb20">
          <label className={labelClassName}>District</label>
          <Select
            options={districtOptions}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            isLoading={loadingDistricts}
            placeholder="Select district"
            styles={customStyles}
            className="select-custom"
            classNamePrefix="select"
            isDisabled={!provinceId}
            isClearable
            noOptionsMessage={() => {
              if (!provinceId) return "Select province first";
              if (loadingDistricts) return "Loading...";
              return "No districts found";
            }}
          />
          {!provinceId && (
            <small className="text-muted">Please select province first</small>
          )}
        </div>
      </div>

      {/* Ward Select */}
      {showWard && (
        <div className="col-sm-6 col-xl-3">
          <div className="mb20">
            <label className={labelClassName}>Ward / Commune</label>
            <Select
              options={wardOptions}
              value={selectedWard}
              onChange={handleWardChange}
              isLoading={loadingWards}
              placeholder="Select ward"
              styles={customStyles}
              className="select-custom"
              classNamePrefix="select"
              isDisabled={!districtId}
              isClearable
              noOptionsMessage={() => {
                if (!districtId) return "Select district first";
                if (loadingWards) return "Loading...";
                return "No wards found";
              }}
            />
            {!districtId && (
              <small className="text-muted">Please select district first</small>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;