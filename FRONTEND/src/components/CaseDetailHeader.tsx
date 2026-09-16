import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import type { CaseDetail, CaseStatus, FraudType } from "../types/case";

interface CaseDetailHeaderProps {
  caseData: CaseDetail;
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

interface MetaFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetaField({ icon, label, value }: MetaFieldProps) {
  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 1,
          bgcolor: "rgba(28, 35, 126, 0.08)",
          color: "primary.main",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}
        >
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CaseDetailHeader({ caseData }: CaseDetailHeaderProps) {
  const date = new Date(caseData.registeredAt);
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #E2E6EF",
        borderTop: "4px solid #D4AF37",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          bgcolor: "primary.main",
          background: "linear-gradient(135deg, #1C237E 0%, #141956 100%)",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "#D4AF37", fontWeight: 600, letterSpacing: "0.12em" }}
          >
            CASE FILE
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#FFFFFF",
              fontWeight: 700,
              fontFamily: "monospace",
              fontSize: { xs: "1.1rem", sm: "1.35rem" },
            }}
          >
            {caseData.id}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={caseData.fraudType}
            sx={{
              bgcolor: `${getFraudTypeColor(caseData.fraudType)}22`,
              color: "#FFFFFF",
              border: `1px solid ${getFraudTypeColor(caseData.fraudType)}`,
              fontWeight: 600,
            }}
          />
          <Chip
            label={caseData.status}
            color={getStatusColor(caseData.status)}
            variant="outlined"
            sx={{
              fontWeight: 600,
              borderColor: "rgba(255,255,255,0.5)",
              color: "#FFFFFF",
            }}
          />
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2.5, sm: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetaField
              icon={<FingerprintOutlinedIcon fontSize="small" />}
              label="Case ID"
              value={caseData.id}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetaField
              icon={<PhoneOutlinedIcon fontSize="small" />}
              label="Caller ID"
              value={caseData.callerId}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetaField
              icon={<FingerprintOutlinedIcon fontSize="small" />}
              label="Fraud Type"
              value={caseData.fraudType}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetaField
              icon={<LocationOnOutlinedIcon fontSize="small" />}
              label="District"
              value={caseData.district}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetaField
              icon={<FingerprintOutlinedIcon fontSize="small" />}
              label="Status"
              value={caseData.status}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetaField
              icon={<CalendarTodayOutlinedIcon fontSize="small" />}
              label="Date"
              value={dateStr}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetaField
              icon={<ScheduleOutlinedIcon fontSize="small" />}
              label="Time"
              value={timeStr}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
