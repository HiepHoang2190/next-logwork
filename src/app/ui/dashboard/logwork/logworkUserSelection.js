
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

const UserSelection = (props) => {
  const { userName, handleChange, dataAllUser } = props;

  const selectFieldStyles = {
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: '#fff'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#fff',
      borderWidth: 'thin'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#fff',
      borderWidth: 'thin'
    },
    '.MuiSelect-select': {
      padding: '4px 14px'
    }
  };

  const selectLabelStyles = {
    '&.MuiFormLabel-root.MuiInputLabel-root': {
      top: '-13px'
    },
    '&.MuiFormLabel-filled.MuiInputLabel-shrink': {
      top: '0px'
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'end', marginLeft: '20px' }}>
      <FormControl>
        <InputLabel style={{ color: '#FFFFFF' }} sx={{ ...selectLabelStyles }} id="user-select-label">Name</InputLabel>
        <Select
          variant="outlined"
          sx={{
            width: 200,
            marginRight: 0,
            color: '#fff',
            '& .MuiSvgIcon-root': {
              color: 'white'
            },
            ...selectFieldStyles
          }}
          labelId="user-select-label"
          id="user-simple-select"
          value={userName}
          label="Name"
          onChange={handleChange}
        >
          {dataAllUser.map((item) => (
            <MenuItem key={item.user_name} value={item.user_name} style={{
              padding: "4px 14px"
            }}>{item.display_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
};

export default UserSelection;