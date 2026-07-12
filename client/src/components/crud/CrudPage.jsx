import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Plus, 
  Search, 
  X, 
  RefreshCw, 
  Download, 
  Eye, 
  Edit2, 
  Trash2, 
  MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { Drawer } from '@/components/ui/Drawer';
import { Modal, ConfirmationDialog } from '@/components/ui/Modal';
import { StatCard } from '@/components/ui/Card';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@/components/ui/Dropdown';
import { cn } from '@/utils';

export function CrudPage({
  service,
  title,
  subtitle,
  columns = [],
  filterConfig = [], // [{ key: 'status', label: 'Status', options: [...] }]
  statCalculator, // (items) => [{ label: 'Total', value: 12, icon: ..., variant: 'blue' }]
  FormComponent, // React component rendering fields: ({ register, errors, control, setValue, watch })
  DetailComponent, // React component rendering details inside drawer: ({ item })
  validationSchema, // Zod validation schema
  defaultValues = {},
  searchKeys = [], // ['name', 'plateNumber']
  className,
}) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterValues, setFilterValues] = useState(() => {
    const initial = {};
    filterConfig.forEach((f) => {
      initial[f.key] = 'all';
    });
    return initial;
  });

  // Table Sort state
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Selected rows
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  // Modals / Drawers state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination local state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = await service.export('csv');
      toast.success(`${title} logs exported successfully: ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to export ${title.toLowerCase()} logs.`);
    } finally {
      setIsExporting(false);
    }
  };

  // 1. Debounce Search queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Fetch list items from service
  const fetchItems = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const data = await service.getAll();
      setItems(data);
    } catch (err) {
      console.error(`Failed to load ${title} data:`, err);
      toast.error(`Could not retrieve ${title} logs.`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [service, title]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, [fetchItems]);

  // 3. React Hook Form setups
  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues
  });

  // Sync edit model resets
  useEffect(() => {
    if (editItem) {
      reset(editItem);
    } else {
      reset(defaultValues);
    }
  }, [editItem, reset, defaultValues]);

  // Reset Create state
  const handleOpenCreate = () => {
    setEditItem(null);
    reset(defaultValues);
    setIsCreateOpen(true);
  };

  // Submit Add / Edit
  const onSubmit = async (formData) => {
    try {
      if (editItem) {
        // Edit update
        await service.update(editItem.id, formData);
        toast.success(`${title} entry updated successfully.`);
      } else {
        // Create new
        await service.create(formData);
        toast.success(`New ${title} entry created successfully.`);
      }
      setIsCreateOpen(false);
      setEditItem(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save record changes.');
    }
  };

  // Trigger Edit
  const handleEditClick = (item) => {
    setEditItem(item);
    setIsCreateOpen(true);
  };

  // Trigger Delete Confirm Dialog
  const handleDeleteClick = (item) => {
    setDeleteItem(item);
  };

  // Confirm Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      await service.delete(deleteItem.id);
      toast.success(`${title} record deleted successfully.`);
      setDeleteItem(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete registry record.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle column header clicks
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // 4. Client Side Filters, Search & Sort calculations
  const filteredItems = items.filter((item) => {
    // A. Match search query
    if (debouncedSearch && searchKeys.length > 0) {
      const match = searchKeys.some((k) => {
        const val = item[k]?.toString().toLowerCase() || '';
        return val.includes(debouncedSearch.toLowerCase());
      });
      if (!match) return false;
    }

    // B. Match Filter dropdowns
    for (const [filterKey, filterVal] of Object.entries(filterValues)) {
      if (filterVal !== 'all' && item[filterKey] !== filterVal) {
        return false;
      }
    }
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal === undefined || bVal === undefined) return 0;

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Paginated Slices
  const totalPages = Math.ceil(sortedItems.length / rowsPerPage);
  const paginatedItems = sortedItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Render stats
  const stats = statCalculator ? statCalculator(items) : [];

  // Table Columns + row actions column
  const enrichedColumns = [
    ...columns,
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (row) => (
        <Dropdown>
          <DropdownTrigger>
            <button className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 cursor-pointer">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </DropdownTrigger>
          <DropdownMenu align="right" className="w-36">
            <DropdownItem icon={Eye} onClick={() => setDetailItem(row)}>
              Inspect details
            </DropdownItem>
            <DropdownItem icon={Edit2} onClick={() => handleEditClick(row)}>
              Edit Record
            </DropdownItem>
            <div className="border-t border-subtle my-1" />
            <DropdownItem icon={Trash2} variant="danger" onClick={() => handleDeleteClick(row)}>
              Delete Record
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className={cn("space-y-6 select-none", className)}>
      {/* 1. Page Header */}
      <PageHeader title={title} description={subtitle} />

      {/* 2. StatDeck Widget */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
              trendValue={stat.trend}
              trendDirection={stat.trendDirection || 'neutral'}
              colorVariant={stat.variant || 'blue'}
            />
          ))}
        </div>
      )}

      {/* 3. Toolbar Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-premium-sm sticky top-16 z-20">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          {/* Search box with Clear action */}
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-8.5 py-2.5 bg-brand-bg border border-slate-200/80 rounded-xl focus:border-brand-primary focus:bg-white focus:outline-none transition-all placeholder-slate-400 font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-655 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dynamic Filters dropdowns */}
          {filterConfig.map((filt) => (
            <div key={filt.key} className="w-40">
              <Select
                options={[{ value: 'all', label: `All ${filt.label}` }, ...filt.options]}
                value={filterValues[filt.key]}
                onChange={(val) => setFilterValues((prev) => ({ ...prev, [filt.key]: val }))}
              />
            </div>
          ))}
        </div>

        {/* Action button deck */}
        <div className="flex items-center gap-2.5 justify-end shrink-0 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchItems(true)}
            isLoading={isRefreshing}
            leftIcon={RefreshCw}
          >
            Sync
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            isLoading={isExporting}
            onClick={handleExport}
          >
            Export
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            leftIcon={Plus}
          >
            Add Record
          </Button>
        </div>
      </div>

      {/* 4. Table view list */}
      <div className="relative">
        <Table
          columns={enrichedColumns}
          data={paginatedItems}
          isLoading={isLoading}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectable
          selectedRowIds={selectedRowIds}
          onSelectRowIds={setSelectedRowIds}
          emptyTitle={`No ${title.toLowerCase()} items found`}
          emptyDescription={`Try modifying your search or click 'Add Record' to create one.`}
          pagination={{
            page,
            totalPages,
            totalCount: sortedItems.length,
            rowsPerPage,
            onPageChange: setPage,
            onRowsPerPageChange: setRowsPerPage,
          }}
          bulkActions={[
            {
              label: 'Delete Selected',
              variant: 'danger',
              onClick: (ids) => {
                if (confirm(`Are you sure you want to delete ${ids.length} records?`)) {
                  ids.forEach(async (id) => {
                    await service.delete(id);
                  });
                  toast.success(`Deleted ${ids.length} records.`);
                  setSelectedRowIds([]);
                  fetchItems();
                }
              },
            },
          ]}
        />
      </div>

      {/* 5. Detail Drawer */}
      <Drawer
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={`${title} Details`}
        size="md"
      >
        {detailItem && DetailComponent && <DetailComponent item={detailItem} />}
      </Drawer>

      {/* 6. Form Modal popup */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditItem(null);
        }}
        title={editItem ? `Edit ${title} entry` : `Register new ${title.toLowerCase()}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left p-1">
          {FormComponent && (
            <FormComponent
              register={register}
              errors={errors}
              control={control}
              setValue={setValue}
              watch={watch}
            />
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-subtle">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditItem(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editItem ? 'Save Changes' : 'Create Entry'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 7. Delete confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Record Deletion"
        message={`Are you sure you want to delete this record? This operation is permanent and cannot be undone.`}
        variant="danger"
        confirmLabel="Delete Permanent"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default CrudPage;
