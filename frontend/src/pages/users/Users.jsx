import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { Table, Button, EmptyState, ErrorState, Loader } from '../../components/ui'
import UserModal from '../../components/UserModal'
import DeleteConfirm from '../../components/DeleteConfirm'
import { getUsers, createUser, updateUser, deleteUser } from '../../services/userService'

export default function Users() {
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchUsers = useCallback(async (page = 0, limit = 10) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getUsers({ page: page + 1, limit })
      setRows(data.data.results)
      setPagination({ page, limit, ...data.data.pagination })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handlePageChange = (_, page) => fetchUsers(page, pagination.limit)
  const handleRowsPerPageChange = (e) => fetchUsers(0, parseInt(e.target.value))

  const handleOpenCreate = () => { setEditUser(null); setModalOpen(true) }
  const handleOpenEdit = (user) => { setEditUser(user); setModalOpen(true) }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      if (editUser) {
        await updateUser(editUser._id, values)
      } else {
        await createUser(values)
      }
      setModalOpen(false)
      fetchUsers(pagination.page, pagination.limit)
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setSubmitting(true)
    try {
      await deleteUser(deleteTarget._id)
      setDeleteTarget(null)
      fetchUsers(pagination.page, pagination.limit)
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (row) => <Chip label={row.role} size="small" color={row.role === 'admin' ? 'primary' : 'default'} /> },
    { key: 'createdAt', label: 'Joined', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenEdit(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
        </Box>
      ),
    },
  ]

  if (error) return <ErrorState message={error} onRetry={() => fetchUsers()} />

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight={600}>Users</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>Add User</Button>
      </Box>

      {loading && rows.length === 0 ? <Loader /> : (
        <Table
          columns={columns}
          rows={rows}
          loading={loading}
          page={pagination.page}
          rowsPerPage={pagination.limit}
          total={pagination.total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          emptyMessage="No users found"
        />
      )}

      <UserModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initial={editUser} loading={submitting} />
      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} message={`Delete user "${deleteTarget?.name}"?`} loading={submitting} />
    </Box>
  )
}
