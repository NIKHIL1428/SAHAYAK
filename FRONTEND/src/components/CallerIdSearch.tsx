import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface CallerIdSearchProps {
  onSearch: (callerId: string) => void;
}

export default function CallerIdSearch({ onSearch }: CallerIdSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query.trim());
  };

  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 2, sm: 3 },
        border: "1px solid #E2E6EF",
        borderLeft: "4px solid #1C237E",
      }}
    >
      <Typography variant="h6" sx={{ mb: 0.5, color: "primary.main" }}>
        Search by Caller ID
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter a phone number or caller ID to filter registered cyber crime cases.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
        }}
      >
        <TextField
          fullWidth
          placeholder="e.g. +91 98765 43210"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#FAFBFD",
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            px: 4,
            minWidth: { xs: "100%", sm: 140 },
            whiteSpace: "nowrap",
          }}
        >
          Search
        </Button>
        {query && (
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => {
              setQuery("");
              onSearch("");
            }}
            sx={{ minWidth: { xs: "100%", sm: 100 } }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Paper>
  );
}
