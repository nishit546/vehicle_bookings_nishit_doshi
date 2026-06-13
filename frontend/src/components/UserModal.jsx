import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { Modal, Button, Input } from './ui'

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters'),
  role: Yup.string().required('Role is required'),
})

export default function UserModal({ open, onClose, onSubmit, initial, loading }) {
  const isEdit = !!initial

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', role: 'user' },
    validationSchema: schema,
    onSubmit: (values) => {
      const payload = { ...values }
      if (isEdit && !payload.password) delete payload.password
      onSubmit(payload)
    },
  })

  useEffect(() => {
    if (open) {
      if (initial) {
        formik.setValues({ name: initial.name || '', email: initial.email || '', password: '', role: initial.role || 'user' })
      } else {
        formik.resetForm()
      }
    }
  }, [open, initial])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit User' : 'Create User'}
      maxWidth="sm"
      actions={
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button onClick={formik.handleSubmit} loading={loading} variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </Box>
      }
    >
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        <Input label="Name" name="name" value={formik.values.name} onChange={formik.handleChange} error={formik.touched.name && formik.errors.name} />
        <Input label="Email" name="email" type="email" value={formik.values.email} onChange={formik.handleChange} error={formik.touched.email && formik.errors.email} />
        <Input label={isEdit ? 'New Password (leave blank to keep)' : 'Password'} name="password" type="password" value={formik.values.password} onChange={formik.handleChange} error={formik.touched.password && formik.errors.password} />
        <Input label="Role" name="role" select value={formik.values.role} onChange={formik.handleChange} error={formik.touched.role && formik.errors.role}>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Input>
      </Box>
    </Modal>
  )
}
