"use client";

import React, { useState, useEffect } from 'react';


import AdvanceFilterModal from "@/components/real-estate/common/advance-filter-two";

import { useProperties } from "@/hook/use-properties";
import { PropertyCardSkeleton } from "@/components/skeleton/property-card-skeleton";
import ListingMap1 from '../../listing/map-style/ListingMap1';
import PaginationTwo from '../../listing/PaginationTwo';
import PropertyCard from '@/components/property/property-card';
import TopFilterBar2 from '../../listing/map-style/map-v1/TopFilterBar2';
import TopFilterBar from '../../listing/map-style/map-v1/TopFilterBar';

export default function PropertyFilteringTwo() {
  // Filters state
  const [listingStatus, setListingStatus] = useState<'All' | 'sale' | 'rent'>('All');
  const [propertyTypes, setPropertyTypes] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [location, setLocation] = useState('');
  const [squirefeet, setSquirefeet] = useState<[number, number]>([0, 10000]);
  const [yearBuild, setYearBuild] = useState<[number, number]>([1900, 2025]);
  const [categories, setCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI state
  const [colstyle, setColstyle] = useState(true);
  const [currentSortingOption, setCurrentSortingOption] = useState('Newest');
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 4;

  // Build filters for API
  const buildFilters = () => {
    const filters: any = {
      page: pageNumber,
      per_page: itemsPerPage,
      sort_by: currentSortingOption === 'Newest' ? 'newest' : 
               currentSortingOption === 'Price Low' ? 'price_asc' :
               currentSortingOption === 'Price High' ? 'price_desc' : 'newest',
    };

    // Add filters if they have values
    if (listingStatus !== 'All') {
      filters.type = listingStatus;
    }
    
    if (propertyTypes.length > 0) {
      filters.category_id = propertyTypes[0]; // API hỗ trợ category_id
    }
    
    if (priceRange[0] > 0) {
      filters.price_min = priceRange[0];
    }
    if (priceRange[1] < 10000000) {
      filters.price_max = priceRange[1];
    }
    
    if (bedrooms > 0) {
      filters.bedrooms = bedrooms;
    }
    
    if (bathrooms > 0) {
      filters.bathrooms = bathrooms;
    }
    
    if (location) {
      filters.district_id = location; // Giả sử location là district_id
    }
    
    if (squirefeet[0] > 0) {
      filters.area_min = squirefeet[0];
    }
    if (squirefeet[1] < 10000) {
      filters.area_max = squirefeet[1];
    }
    
    if (yearBuild[0] > 1900) {
      filters.year_built_min = yearBuild[0];
    }
    if (yearBuild[1] < 2025) {
      filters.year_built_max = yearBuild[1];
    }
    
    if (searchQuery) {
      filters.keyword = searchQuery;
    }

    return filters;
  };

  // Use properties hook
  const {
    properties,
    isLoading,
    isFetching,
    total,
    currentPage,
    lastPage,
    filters,
    handleFilterChange,
    handlePageChange,
    handleSortChange,
    refresh
  } = useProperties({
    initialFilters: buildFilters(),
    type: 'public'
  });

  // Update filters when filter state changes
  useEffect(() => {
    const newFilters = buildFilters();
    handleFilterChange(newFilters);
  }, [
    listingStatus,
    propertyTypes,
    priceRange,
    bedrooms,
    bathrooms,
    location,
    squirefeet,
    yearBuild,
    categories,
    searchQuery,
    currentSortingOption
  ]);

  // Reset all filters
  const resetFilter = () => {
    setListingStatus('All');
    setPropertyTypes([]);
    setPriceRange([0, 10000000]);
    setBedrooms(0);
    setBathrooms(0);
    setLocation('');
    setSquirefeet([0, 10000]);
    setYearBuild([1900, 2025]);
    setCategories([]);
    setCurrentSortingOption('Newest');
    setSearchQuery('');
    
    // Reset input fields
    document.querySelectorAll(".filterInput").forEach((element) => {
      (element as HTMLInputElement).value = '';
    });
    document.querySelectorAll(".filterSelect").forEach((element) => {
      (element as HTMLSelectElement).value = '';
    });
  };

  // Filter functions object for child components
  const filterFunctions = {
    handlelistingStatus: (status: 'sale' | 'rent') => {
      setListingStatus(prev => prev === status ? 'All' : status);
    },
    handlepropertyTypes: (typeId: number) => {
      setPropertyTypes(prev => 
        prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
      );
    },
    handlepriceRange: (range: [number, number]) => setPriceRange(range),
    handlebedrooms: (num: number) => setBedrooms(num),
    handlebathroms: (num: number) => setBathrooms(num),
    handlelocation: (loc: string) => setLocation(loc),
    handlesquirefeet: (range: [number, number]) => setSquirefeet(range),
    handleyearBuild: (range: [number, number]) => setYearBuild(range),
    handlecategories: (categoryId: number) => {
      setCategories(prev => 
        prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
      );
    },
    setPropertyTypes,
    setSearchQuery,
    resetFilter,
    priceRange,
    listingStatus,
    propertyTypes,
    bedrooms,
    bathroms: bathrooms,
    location,
    squirefeet,
    yearBuild,
    categories,
  };

  // Page content tracking
  const pageContentTrac = [
    ((currentPage - 1) * itemsPerPage) + 1,
    Math.min(currentPage * itemsPerPage, total),
    total
  ];

  return (
    <>
      {/* Advance Feature Modal */}
      <div className="advance-feature-modal">
        <div
          className="modal fade"
          id="advanceSeachModal"
          tabIndex={-1}
          aria-labelledby="advanceSeachModalLabel"
          aria-hidden="true"
        >
          <AdvanceFilterModal filterFunctions={filterFunctions} />
        </div>
      </div>

      {/* Property Filtering */}
      <section className="p-0 bgc-f7">
        <div className="container-fluid">
          <div className="row" data-aos="fade-up" data-aos-duration="200">
            <div className="col-xl-5">
              <div className="half_map_area_content mt30">
                <div className="col-lg-12">
                  <div className="advance-search-list d-flex justify-content-between">
                    <div className="dropdown-lists">
                      <ul className="p-0 mb-0">
                        <TopFilterBar2 filterFunctions={filterFunctions} />
                      </ul>
                    </div>
                  </div>
                </div>

                <h4 className="mb-1">
                  {location ? `${location} Properties` : 'Properties for Sale'}
                </h4>

                <div className="row align-items-center mb10">
                  <TopFilterBar 
                    pageContentTrac={pageContentTrac}
                    colstyle={colstyle}
                    setColstyle={setColstyle}
                    setCurrentSortingOption={setCurrentSortingOption}
                  />
                </div>

                <div className="row">
                  {isLoading || isFetching ? (
                    // Skeleton loading
                    Array(4).fill(0).map((_, index) => (
                      <div key={index} className={colstyle ? 'col-sm-12' : 'col-md-6'}>
                        <PropertyCardSkeleton colstyle={colstyle} />
                      </div>
                    ))
                  ) : (
                    <PropertyCard colstyle={colstyle} property={properties} />
                  )}
                </div>

                {!isLoading && properties.length === 0 && (
                  <div className="row text-center py-5">
                    <div className="col-12">
                      <p className="text-muted">No properties found matching your criteria</p>
                    </div>
                  </div>
                )}

                <div className="row text-center">
                  {total > itemsPerPage && (
                    <PaginationTwo 
                      pageCapacity={itemsPerPage}
                      data={properties}
                      pageNumber={currentPage}
                      setPageNumber={handlePageChange}
                      totalPages={lastPage}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-xl-7 overflow-hidden position-relative">
              <div className="half_map_area map-canvas half_style">
                <ListingMap1 properties={properties} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}