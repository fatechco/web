"use client";

import { useState } from "react";
import { useDeleteProperty, useProperties } from "@/hook/use-properties";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import FilterHeader from "@/components/real-estate/property/dashboard/dashboard-my-properties/FilterHeader";
import PropertyDataTable from "@/components/real-estate/property/dashboard/dashboard-my-properties/PropertyDataTable";
import Pagination from "@/components/real-estate/property/Pagination";
import ConfirmDialog from "@/components/real-estate/common/ConfirmDialog";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { PlusIcon } from "@/assets/icons/plus";

const DashboardMyProperties = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id?: number;
    isBulk?: boolean;
  }>({ isOpen: false });

  // Sử dụng useProperties với type='user' để lấy properties của user hiện tại
  const {
    properties,
    paginateInfo,
    isLoading,
    isFetching,
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
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

  const { deleteProperty, isDeleting } = useDeleteProperty();
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

  // Handle single delete click
  const handleDeleteClick = (id: number) => {
    setDeleteConfirm({
      isOpen: true,
      id: id,
      isBulk: false,
    });
  };

  // Handle bulk delete click
  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) return;
    setDeleteConfirm({
      isOpen: true,
      isBulk: true,
    });
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteConfirm.isBulk) {
      deleteProperty(selectedIds, {
        onSuccess: () => {
          setSelectedIds([]);
          setDeleteConfirm({ isOpen: false });
        },
        onError: () => {
          setDeleteConfirm({ isOpen: false });
        }
      });
    } else if (deleteConfirm.id) {
      deleteProperty([deleteConfirm.id], {
        onSuccess: () => {
          setDeleteConfirm({ isOpen: false });
        },
        onError: () => {
          setDeleteConfirm({ isOpen: false });
        }
      });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false });
  };

  // Handle edit
  const handleEdit = (property: any) => {
    router.push(`/dashboard/edit-property/${property.uuid}`);
  };

  // Handle export
  const handleExport = () => {
    console.log('Export properties');
  };

  // Get delete message based on selection
  const getDeleteMessage = () => {
    if (deleteConfirm.isBulk) {
      return t('confirm.delete.selected.message', { count: selectedIds.length });
    }
    const property = properties.find(p => p.id === deleteConfirm.id);
    const title = property?.title || '';
    return t('confirm.delete.single.message', { title });
  };

  return (
    <>
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.isBulk ? t('confirm.delete.bulk.title') : t('confirm.delete.title')}
        message={getDeleteMessage()}
        warning={t('confirm.delete.warning')}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        confirmVariant="danger"
        icon="delete"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isConfirming={isDeleting}
      />

      {/* Quick Stats Row */}
      <div className="row mt-5 g-4">
        <div className="col-md-3 col-sm-6">
          <div className="stat-card stat-card-primary">
            <div className="stat-card-inner">
              <div className="stat-icon-wrapper">
                <span className="stat-icon flaticon-home" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{total || 0}</h3>
                <p className="stat-label">{t('total.properties')}</p>
              </div>
            </div>
            <div className="stat-trend stat-trend-up">
              <i className="fas fa-arrow-up" />
              <span>+12%</span>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6">
          <div className="stat-card stat-card-success">
            <div className="stat-card-inner">
              <div className="stat-icon-wrapper">
                <span className="stat-icon flaticon-checkmark" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{properties.filter(p => p.status === 'published' || p.status === 'available').length}</h3>
                <p className="stat-label">{t('published')}</p>
              </div>
            </div>
            <div className="stat-trend stat-trend-up">
              <i className="fas fa-arrow-up" />
              <span>+5%</span>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6">
          <div className="stat-card stat-card-warning">
            <div className="stat-card-inner">
              <div className="stat-icon-wrapper">
                <span className="stat-icon flaticon-clock" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{properties.filter(p => p.status === 'pending').length}</h3>
                <p className="stat-label">{t('pending')}</p>
              </div>
            </div>
            <div className="stat-trend stat-trend-down">
              <i className="fas fa-arrow-down" />
              <span>-3%</span>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6">
          <div className="stat-card stat-card-info">
            <div className="stat-card-inner">
              <div className="stat-icon-wrapper">
                <span className="stat-icon flaticon-view" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{properties.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}</h3>
                <p className="stat-label">{t('total.views')}</p>
              </div>
            </div>
            <div className="stat-trend stat-trend-up">
              <i className="fas fa-arrow-up" />
              <span>+23%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row align-items-center mt30 pb40">
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
                  onClick={handleBulkDeleteClick}
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
                        {t('add.new.property')}
                      </Link>
                    </div>
                  ) : (
                    <div className="packages_table table-responsive">
                      <PropertyDataTable 
                        properties={properties}
                        onDelete={handleDeleteClick}
                        onEdit={handleEdit}
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

      <style jsx>{`
        .stat-card {
          position: relative;
          background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .stat-card-inner {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
          transition: all 0.3s ease;
        }

        .stat-card:hover .stat-icon-wrapper {
          transform: scale(1.05);
        }

        .stat-icon {
          font-size: 32px;
          line-height: 1;
        }

        .stat-card-primary .stat-icon {
          color: #3b82f6;
        }

        .stat-card-primary .stat-icon-wrapper {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
        }

        .stat-card-success .stat-icon {
          color: #10b981;
        }

        .stat-card-success .stat-icon-wrapper {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
        }

        .stat-card-warning .stat-icon {
          color: #f59e0b;
        }

        .stat-card-warning .stat-icon-wrapper {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
        }

        .stat-card-info .stat-icon {
          color: #8b5cf6;
        }

        .stat-card-info .stat-icon-wrapper {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
          color: #1f2937;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          margin-top: 4px;
          font-weight: 500;
        }

        .stat-trend {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.05);
        }

        .stat-trend-up {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .stat-trend-down {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .stat-trend i {
          font-size: 10px;
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-number {
          animation: countUp 0.5s ease-out;
        }

        @media (max-width: 768px) {
          .stat-card {
            padding: 1rem;
          }
          
          .stat-icon-wrapper {
            width: 48px;
            height: 48px;
          }
          
          .stat-icon {
            font-size: 24px;
          }
          
          .stat-number {
            font-size: 22px;
          }
          
          .stat-label {
            font-size: 12px;
          }
          
          .stat-trend {
            font-size: 10px;
            padding: 2px 6px;
          }
        }
      `}</style>
    </>
  );
};

export default DashboardMyProperties;