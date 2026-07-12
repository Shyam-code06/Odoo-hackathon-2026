import { useState, useEffect, useCallback } from 'react';
import { 
  Users, UserPlus, Search, Shield, ShieldAlert, KeyRound, 
  UserX, UserCheck, Trash2, MoreHorizontal, X, Edit2, ShieldCheck, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { Modal, ConfirmationDialog } from '@/components/ui/Modal';
import { StatCard } from '@/components/ui/Card';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@/components/ui/Dropdown';
import { StatusChip } from '@/components/ui/StatusChip';
import { FormField } from '@/components/ui/Form';
import { useAuth } from '@/hooks/useAuth';
import userService from '@/services/userService';
import { USER_ROLE_LABELS, USER_ROLE_COLORS } from '@/constants';

const ROLES = [
  { value: 'DISPATCHER', label: 'Dispatcher' },
  { value: 'SAFETY_OFFICER', label: 'Safety Officer' },
  { value: 'FINANCIAL_ANALYST', label: 'Financial Analyst' },
  { value: 'MAINTENANCE_MANAGER', label: 'Maintenance Manager' },
  { value: 'DRIVER_MANAGER', label: 'Driver Manager' },
  { value: 'VIEWER', label: 'Viewer' }
];

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Selected item state
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'VIEWER' });
  const [editFormData, setEditFormData] = useState({ name: '', role: 'VIEWER' });
  const [newPassword, setNewPassword] = useState('');

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load user management directory.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Actions
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error('All fields are required.');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    try {
      await userService.create(formData);
      toast.success(`User '${formData.name}' created successfully.`);
      setIsAddOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'VIEWER' });
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create user.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.role) {
      toast.error('Name and Role are required.');
      return;
    }
    try {
      await userService.update(selectedUser.id, editFormData);
      toast.success('User updated successfully.');
      setIsEditOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to update user.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    try {
      await userService.resetPassword(selectedUser.id, newPassword);
      toast.success(`Password updated for '${selectedUser.name}'.`);
      setIsResetOpen(false);
      setNewPassword('');
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to reset password.');
    }
  };

  const handleDeactivateConfirm = async () => {
    try {
      await userService.deactivate(selectedUser.id);
      toast.success(`User account for '${selectedUser.name}' deactivated.`);
      setIsDeactivateOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Deactivation failed.');
    }
  };

  const handleActivateConfirm = async () => {
    try {
      await userService.activate(selectedUser.id);
      toast.success(`User account for '${selectedUser.name}' reactivated.`);
      setIsActivateOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Activation failed.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.delete(selectedUser.id);
      toast.success(`User record permanently deleted.`);
      setIsDeleteOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Delete failed.');
    }
  };

  // Filter calculations
  const filteredUsers = users.filter((u) => {
    const matchesSearch = searchQuery === '' || 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && u.isActive) ||
      (statusFilter === 'deactivated' && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // KPI calculations
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.isActive).length;
  const deactivatedCount = totalCount - activeCount;
  const fmCount = users.filter((u) => u.role === 'fleet_manager').length;

  const stats = [
    { label: 'Total Organization Users', value: totalCount, icon: Users, variant: 'blue' },
    { label: 'Active Staff Member', value: activeCount, icon: ShieldCheck, variant: 'emerald' },
    { label: 'Deactivated Accounts', value: deactivatedCount, icon: UserX, variant: 'rose' },
    { label: 'Fleet Manager Owner', value: fmCount, icon: Shield, variant: 'purple' }
  ];

  // Table Columns
  const columns = [
    {
      key: 'name',
      header: 'Full Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 select-none">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-slate-800 tracking-tight">{row.name}</span>
            {row.id === currentUser?.id && (
              <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md w-fit mt-0.5">Your Account</span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email Address',
      sortable: true,
      render: (row) => (
        <span className="text-slate-655 font-medium flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          {row.email}
        </span>
      )
    },
    {
      key: 'role',
      header: 'Administrative Role',
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border bg-opacity-10 capitalize
          ${row.role === 'fleet_manager' ? 'bg-blue-500 text-blue-700 border-blue-200' :
            row.role === 'dispatcher' ? 'bg-sky-500 text-sky-700 border-sky-200' :
            row.role === 'safety_officer' ? 'bg-emerald-500 text-emerald-700 border-emerald-200' :
            row.role === 'financial_analyst' ? 'bg-purple-500 text-purple-700 border-purple-200' :
            row.role === 'maintenance_manager' ? 'bg-amber-500 text-amber-700 border-amber-200' :
            row.role === 'driver_manager' ? 'bg-teal-500 text-teal-700 border-teal-200' :
            'bg-slate-500 text-slate-700 border-slate-200'
          }`}
        >
          {USER_ROLE_LABELS[row.role] || row.role}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${row.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
          <span className={`w-2 h-2 rounded-full ${row.isActive ? 'bg-emerald-500' : 'bg-slate-350'}`} />
          {row.isActive ? 'Active' : 'Deactivated'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (row) => {
        // Can't edit or deactivate the default admin or yourself
        const isDisabled = row.isDefault || row.id === currentUser?.id;
        
        return (
          <Dropdown>
            <DropdownTrigger>
              <button className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 cursor-pointer">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </DropdownTrigger>
            <DropdownMenu align="right" className="w-44 text-left">
              <DropdownItem 
                icon={Edit2} 
                onClick={() => {
                  setSelectedUser(row);
                  setEditFormData({ name: row.name, role: row.role.toUpperCase() });
                  setIsEditOpen(true);
                }}
                disabled={row.isDefault}
              >
                Modify details
              </DropdownItem>
              <DropdownItem 
                icon={KeyRound} 
                onClick={() => {
                  setSelectedUser(row);
                  setIsResetOpen(true);
                }}
              >
                Reset Password
              </DropdownItem>
              
              <div className="border-t border-subtle my-1" />
              
              {row.isActive ? (
                <DropdownItem 
                  icon={UserX} 
                  onClick={() => {
                    setSelectedUser(row);
                    setIsDeactivateOpen(true);
                  }}
                  disabled={isDisabled}
                  variant="danger"
                >
                  Deactivate Member
                </DropdownItem>
              ) : (
                <DropdownItem 
                  icon={UserCheck} 
                  onClick={() => {
                    setSelectedUser(row);
                    setIsActivateOpen(true);
                  }}
                  disabled={isDisabled}
                >
                  Reactivate Member
                </DropdownItem>
              )}

              <DropdownItem 
                icon={Trash2} 
                variant="danger" 
                onClick={() => {
                  setSelectedUser(row);
                  setIsDeleteOpen(true);
                }}
                disabled={isDisabled}
              >
                Delete Record
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 select-none">
      {/* 1. Page Header */}
      <PageHeader 
        title="User Management" 
        description="Invite staff, modify access roles, and monitor tenant users." 
      />

      {/* 2. StatDeck cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            colorVariant={stat.variant}
          />
        ))}
      </div>

      {/* 3. Toolbar Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-premium-sm sticky top-16 z-20">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          {/* Search field */}
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search member name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-8.5 py-2.5 bg-brand-bg border border-slate-200/80 rounded-xl focus:border-brand-primary focus:bg-white focus:outline-none transition-all placeholder-slate-400 font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="w-40">
            <Select
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'fleet_manager', label: 'Fleet Manager' },
                { value: 'dispatcher', label: 'Dispatcher' },
                { value: 'safety_officer', label: 'Safety Officer' },
                { value: 'financial_analyst', label: 'Financial Analyst' },
                { value: 'maintenance_manager', label: 'Maintenance Manager' },
                { value: 'driver_manager', label: 'Driver Manager' },
                { value: 'viewer', label: 'Viewer' }
              ]}
              value={roleFilter}
              onChange={setRoleFilter}
            />
          </div>

          {/* Status Filter */}
          <div className="w-40">
            <Select
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active Users' },
                { value: 'deactivated', label: 'Deactivated Users' }
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        {/* Add User trigger */}
        <div className="flex items-center gap-2.5 justify-end shrink-0 self-start md:self-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            leftIcon={UserPlus}
          >
            Add Member
          </Button>
        </div>
      </div>

      {/* 4. Table directory */}
      <div className="relative">
        <Table
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          emptyTitle="No members matched search criteria"
          emptyDescription="Modify filters or add a new team member to get started."
        />
      </div>

      {/* ── MODALS ── */}

      {/* A. Create Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Organization User">
        <form onSubmit={handleAddSubmit} className="space-y-4 text-left p-1">
          <FormField label="Full Name" isRequired>
            <Input 
              type="text" 
              placeholder="e.g. Samuel Green" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <FormField label="Work Email Address" isRequired>
            <Input 
              type="email" 
              placeholder="e.g. sam@transitops.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </FormField>

          <FormField label="Initial Sign-In Password" isRequired>
            <Input 
              type="password" 
              placeholder="Min 6 characters" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </FormField>

          <FormField label="Administrative Role" isRequired>
            <Select 
              options={ROLES}
              value={formData.role}
              onChange={(val) => setFormData({ ...formData, role: val })}
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-subtle">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create User</Button>
          </div>
        </form>
      </Modal>

      {/* B. Edit Details Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Member Details">
        <form onSubmit={handleEditSubmit} className="space-y-4 text-left p-1">
          <FormField label="Full Name" isRequired>
            <Input 
              type="text" 
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            />
          </FormField>

          <FormField label="Administrative Role" isRequired>
            <Select 
              options={ROLES}
              value={editFormData.role}
              onChange={(val) => setEditFormData({ ...editFormData, role: val })}
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-subtle">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Updates</Button>
          </div>
        </form>
      </Modal>

      {/* C. Reset Password Modal */}
      <Modal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} title="Administrative Password Override">
        <form onSubmit={handleResetSubmit} className="space-y-4 text-left p-1">
          <p className="text-xs text-slate-500 leading-normal">
            As Fleet Manager, you are overriding the password credentials for **{selectedUser?.name}**. 
            Ensure you share the new credentials securely.
          </p>

          <FormField label="Specify New Password" isRequired>
            <Input 
              type="password" 
              placeholder="Enter new 6+ char password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-subtle">
            <Button type="button" variant="outline" onClick={() => setIsResetOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Override Password</Button>
          </div>
        </form>
      </Modal>

      {/* D. Deactivate Dialog */}
      <ConfirmationDialog
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Confirm User Deactivation"
        message={`Are you sure you want to deactivate the account for '${selectedUser?.name}'? They will immediately lose dashboard session access.`}
        variant="danger"
        confirmLabel="Deactivate User"
      />

      {/* E. Activate Dialog */}
      <ConfirmationDialog
        isOpen={isActivateOpen}
        onClose={() => setIsActivateOpen(false)}
        onConfirm={handleActivateConfirm}
        title="Reactivate User Account"
        message={`Are you sure you want to restore access for '${selectedUser?.name}'? They will be allowed to log in using their credentials again.`}
        variant="primary"
        confirmLabel="Reactivate Account"
      />

      {/* F. Delete Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Permanently Delete User"
        message={`Warning: You are about to permanently delete '${selectedUser?.name}'. This action is destructive and cannot be undone.`}
        variant="danger"
        confirmLabel="Delete User Record"
      />
    </div>
  );
}

export default UserManagement;
