import {InputAdornment, TextField} from "@mui/material";
import {Search} from "@mui/icons-material";

export default function SearchBar() {
  return (
    <TextField
      placeholder={"Search users, destinations, travelers, trips..."}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search/>
          </InputAdornment>
        ),
      }}
      fullWidth
    />
  )
}
