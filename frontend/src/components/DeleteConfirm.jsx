import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Modal, Button } from './ui'

export default function DeleteConfirm({ open, onClose, onConfirm, title = 'Confirm Delete', message = 'Are you sure? This action cannot be undone.', loading }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="xs"
      actions={
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button onClick={onConfirm} loading={loading} variant="contained" color="error">Delete</Button>
        </Box>
      }
    >
      <Typography variant="body1">{message}</Typography>
    </Modal>
  )
}
