import TextField from '@mui/material/TextField'

export default function Input({ label, name, value, onChange, error, helperText, type, required, fullWidth, multiline, rows, ...props }) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || helperText}
      type={type}
      required={required}
      fullWidth={fullWidth !== false}
      multiline={multiline}
      rows={rows}
      variant="outlined"
      size="small"
      {...props}
    />
  )
}
