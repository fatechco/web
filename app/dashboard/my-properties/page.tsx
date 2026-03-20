"use client";

import React, { useState } from "react";
import { useProperties } from "@/hook/use-properties";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import FilterHeader from "@/components/real-estate/property/dashboard/dashboard-my-properties/FilterHeader";
import PropertyDataTable from "@/components/real-estate/property/dashboard/dashboard-my-properties/PropertyDataTable";
import Pagination from "@/components/real-estate/property/Pagination";
import { useTranslation } from "react-i18next";
import Link from "next/link";
// /import { PlusIcon } from "@/assets/icons/plus";
import DashboardLayout from "@/components/real-estate/dashboard/DashboardLayout";

const DashboardMyProperties = () => {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Sử dụng useProperties với type='user' để lấy properties của user hiện tại
  const {
    properties,
    paginateInfo,
    isLoading,
    isFetching,
    isDeleting,
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    deleteProperties,
    refresh,
    filters,
    total,
    currentPage,
    lastPage,
  } = useProperties({
    type: 'user',
    initialFilters: {
      per_page: 10,
      sort_by: 'newest',
    }
  });

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(properties.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle select single
  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    
    if (window.confirm(t('confirm.delete.selected', { count: selectedIds.length }))) {
      deleteProperties(selectedIds, {
        onSuccess: () => {
          setSelectedIds([]);
        }
      });
    }
  };

  // Handle export
  const handleExport = () => {
    // Implement export logic
    console.log('Export properties');
  };

  return (
   <>
      <div className="row align-items-center pb40">
        <div className="col-xxl-3">
          <div className="dashboard_title_area">
            <h2>{t('my.properties')}</h2>
            <p className="text">{t('manage.your.property.listings')}</p>
          </div>
        </div>
        <div className="col-xxl-9">
          <FilterHeader 
            onSearch={handleSearch}
            onSort={handleSort}
            isLoading={isFetching}
            initialSearch={filters.keyword}
            initialSort={filters.sort_by}
            placeholder={t('search.properties')}
          />
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="row mb20">
          <div className="col-12">
            <div className="bg-light p-3 rounded-3 d-flex align-items-center justify-content-between">
              <span className="fw500">
                {t('selected.count', { count: selectedIds.length })}
              </span>
              <div className="d-flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="ud-btn btn-outline-danger"
                  disabled={isDeleting}
                >
                  {isDeleting ? t('deleting') : t('delete.selected')}
                </button>
                <button
                  onClick={handleExport}
                  className="ud-btn btn-outline-secondary"
                >
                  {t('export')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Property Button for Mobile */}
      <div className="d-block d-xxl-none mb20">
        <Link href="/dashboard/add-property" className="ud-btn btn-thm w-100">
          {/* <PlusIcon className="me-2" /> */}
          {t('add.new.property')}
        </Link>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            {isLoading ? (
              <TableSkeleton 
                rows={10}
                columns={5}
                hasImage={true}
                hasActions={true}
              />
            ) : (
              <>
                {/* Loading Overlay */}
                <div style={{ position: 'relative', minHeight: 400 }}>
                  {isFetching && !isLoading && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(2px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        borderRadius: '12px',
                      }}
                    >
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">{t('loading')}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Empty State */}
                  {properties.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="mb4">
                        <i className="flaticon-home display-1 text-gray" />
                      </div>
                      <h4 className="mb20">{t('no.properties.found')}</h4>
                      <p className="text-gray-600 mb30">
                        {t('start.adding.your.first.property')}
                      </p>
                      <Link href="/dashboard/add-property" className="ud-btn btn-thm">
                       {/*  <PlusIcon className="me-2" /> */}
                        {t('add.new.property')}
                      </Link>
                    </div>
                  ) : (
                    <div className="packages_table table-responsive">
                      <PropertyDataTable 
                        properties={properties}
                        onDelete={(id) => {
                          if (window.confirm(t('confirm.delete'))) {
                            deleteProperties([id]);
                          }
                        }}
                        onEdit={(property) => {
                          // Navigate to edit page
                          window.location.href = `/dashboard/edit-property/${property.id}`;
                        }}
                        isDeleting={isDeleting}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                      />
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {lastPage > 1 && properties.length > 0 && (
                  <div className="mt30">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={lastPage}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      total={total}
                      pageSize={filters.per_page || 10}
                      showPageSize={true}
                      pageSizeOptions={[10, 20, 50, 100]}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="row mt30">
        <div className="col-md-3 col-sm-6">
          <div className="ff_one">
            <div className="icon">
              <span className="flaticon-home" />
            </div>
            <div className="detais">
              <div className="timer">{total || 0}</div>
              <p>{t('total.properties')}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="ff_one">
            <div className="icon">
              <span className="flaticon-checkmark" />
            </div>
            <div className="detais">
              <div className="timer">
                {properties.filter(p => p.status === 'published').length}
              </div>
              <p>{t('published')}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="ff_one">
            <div className="icon">
              <span className="flaticon-clock" />
            </div>
            <div className="detais">
              <div className="timer">
                {properties.filter(p => p.status === 'pending').length}
              </div>
              <p>{t('pending')}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="ff_one">
            <div className="icon">
              <span className="flaticon-view" />
            </div>
            <div className="detais">
              <div className="timer">
                {properties.reduce((sum, p) => sum + (p.views || 0), 0)}
              </div>
              <p>{t('total.views')}</p>
            </div>
          </div>
        </div>
      </div>
   </>  
  );
};

export default DashboardMyProperties;