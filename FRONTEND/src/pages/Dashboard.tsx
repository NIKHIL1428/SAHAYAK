import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { Alert, Box, Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardData } from "../api/cases";
import CallerIdSearch from "../components/CallerIdSearch";
import DashboardHeader from "../components/DashboardHeader";
import RecentCasesTable from "../components/RecentCasesTable";
import StatCard from "../components/StatCard";
import UploadCaseDialog from "../components/UploadCaseDialog";
import type { CyberCase, DashboardStats } from "../types/case";

const emptyStats: DashboardStats = {
  totalCases: 0,
  todaysCases: 0,
  upiFraud: 0,
  otpFraud: 0,
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cases, setCases] = useState<CyberCase[]>([]);
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const navigate = useNavigate();

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDashboardData();
      setCases(data.cases);
      setStats(data.stats);
    } catch (err) {
      setCases([]);
      setStats(emptyStats);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const filteredCases = useMemo(() => {
    if (!searchQuery) return cases;

    const normalized = searchQuery.replace(/\s+/g, "").toLowerCase();
    return cases.filter((caseItem) =>
      caseItem.callerId.replace(/\s+/g, "").toLowerCase().includes(normalized) ||
      caseItem.id.replace(/\s+/g, "").toLowerCase().includes(normalized)
    );
  }, [cases, searchQuery]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <DashboardHeader />

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ color: "primary.main", fontWeight: 700, mb: 0.5 }}
            >
              Dashboard Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time summary of cyber crime cases registered across Delhi NCR.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => setUploadOpen(true)}
              sx={{
                backgroundColor: "#1C237E",
                "&:hover": { backgroundColor: "#141956" },
                whiteSpace: "nowrap",
              }}
            >
              Upload Case
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/bulk-share")}
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              Bulk Share
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={() => void loadDashboard()}>
                Retry
              </Button>
            }
          >
            {error} Make sure the backend is running on port 8000.
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                  title="Total Cases"
                  value={stats.totalCases}
                  icon={<FolderOpenOutlinedIcon />}
                  accentColor="#1C237E"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                  title="Today's Cases"
                  value={stats.todaysCases}
                  icon={<TodayOutlinedIcon />}
                  accentColor="#D4AF37"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                  title="UPI Fraud"
                  value={stats.upiFraud}
                  icon={<AccountBalanceWalletOutlinedIcon />}
                  accentColor="#1C237E"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                  title="OTP Fraud"
                  value={stats.otpFraud}
                  icon={<MessageOutlinedIcon />}
                  accentColor="#E31E24"
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mb: 3,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <CallerIdSearch onSearch={setSearchQuery} />
              </Box>
              <Button
                variant="outlined"
                startIcon={<RefreshOutlinedIcon />}
                onClick={() => void loadDashboard()}
                sx={{ whiteSpace: "nowrap" }}
              >
                Refresh
              </Button>
            </Box>

            <RecentCasesTable cases={filteredCases} searchQuery={searchQuery} />
          </>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mt: 3, py: 1 }}
        >
          © {new Date().getFullYear()} Delhi Police — Cyber Crime Unit. Authorized personnel only.
        </Typography>
      </Container>
      <UploadCaseDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => {
          setUploadOpen(false);
          void loadDashboard();
        }}
      />
    </Box>
  );
}
