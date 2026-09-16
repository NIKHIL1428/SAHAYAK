import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { CaseStatus, CyberCase, FraudType } from "../types/case";

interface RecentCasesTableProps {
  cases: CyberCase[];
  searchQuery?: string;
}

function getStatusColor(status: CaseStatus): "error" | "warning" | "success" | "info" {
  switch (status) {
    case "Open":
      return "info";
    case "Under Investigation":
      return "warning";
    case "Escalated":
      return "error";
    case "Closed":
      return "success";
  }
}

function getFraudTypeColor(fraudType: FraudType): string {
  switch (fraudType) {
    case "UPI Fraud":
      return "#1C237E";
    case "OTP Fraud":
      return "#E31E24";
    case "Phishing":
      return "#D4AF37";
    default:
      return "#5A6178";
  }
}

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function RecentCasesTable({ cases, searchQuery }: RecentCasesTableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #E2E6EF",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 1,
          borderBottom: "1px solid #E2E6EF",
          bgcolor: "#FAFBFD",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            Recent Cases
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : "Latest registered cyber crime complaints"}
          </Typography>
        </Box>
        <Chip
          label={`${cases.length} case${cases.length !== 1 ? "s" : ""}`}
          size="small"
          sx={{
            bgcolor: "primary.main",
            color: "#FFFFFF",
            fontWeight: 600,
          }}
        />
      </Box>

      <TableContainer sx={{ maxHeight: 480 }}>
        <Table stickyHeader size="small" aria-label="Recent cyber crime cases">
          <TableHead>
            <TableRow>
              <TableCell>Case ID</TableCell>
              <TableCell>Caller ID</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Complainant
              </TableCell>
              <TableCell>Fraud Type</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                District
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                Registered
              </TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {searchQuery
                      ? "No cases found matching the caller ID."
                      : "No processed cases yet. Run the pipeline to create cases."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              cases.map((caseItem) => (
                <TableRow
                  key={caseItem.id}
                  hover
                  sx={{
                    "&:nth-of-type(even)": { bgcolor: "#FAFBFD" },
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, fontFamily: "monospace", fontSize: "0.8rem" }}
                    >
                      {caseItem.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {caseItem.callerId}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {caseItem.complainant}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={caseItem.fraudType}
                      size="small"
                      sx={{
                        bgcolor: `${getFraudTypeColor(caseItem.fraudType)}14`,
                        color: getFraudTypeColor(caseItem.fraudType),
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {caseItem.district}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={caseItem.status}
                      size="small"
                      color={getStatusColor(caseItem.status)}
                      variant="outlined"
                      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(caseItem.registeredAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View case details">
                      <IconButton
                        component={RouterLink}
                        to={`/cases/${caseItem.id}`}
                        size="small"
                        color="primary"
                        aria-label="View case"
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
