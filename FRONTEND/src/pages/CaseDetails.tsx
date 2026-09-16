import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import { fetchCaseById } from "../api/cases";
import CaseDetailHeader from "../components/CaseDetailHeader";
import ConversationSummaryTab from "../components/case-detail/ConversationSummaryTab";
import InformationCollectedTab from "../components/case-detail/InformationCollectedTab";
import TabPanel, { tabA11yProps } from "../components/case-detail/TabPanel";
import VoiceRecordingTab from "../components/case-detail/VoiceRecordingTab";
import DashboardHeader from "../components/DashboardHeader";
import ShareCaseDialog from "../components/ShareCaseDialog";
import type { CaseDetail } from "../types/case";

export default function CaseDetails() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCase = useCallback(async () => {
    if (!caseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const detail = await fetchCaseById(caseId);
      setCaseData(detail);
    } catch (err) {
      setCaseData(null);
      setError(err instanceof Error ? err.message : "Failed to load case details.");
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    void loadCase();
  }, [loadCase]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <DashboardHeader />
        <Container maxWidth="xl" sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress color="primary" />
        </Container>
      </Box>
    );
  }

  if (!caseData) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <DashboardHeader />
        <Container maxWidth="xl" sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Case Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No case file exists for ID: {caseId ?? "—"}
          </Typography>
          {error && (
            <Alert severity="warning" sx={{ mb: 3, textAlign: "left" }}>
              {error}
            </Alert>
          )}
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            startIcon={<ArrowBackOutlinedIcon />}
          >
            Back to Dashboard
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <DashboardHeader />

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackOutlinedIcon />}
          sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
        >
          Back to Dashboard
        </Button>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, mb: 0.5 }}>
              Case Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complainant: {caseData.complainant} · Registered investigation file
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => navigate("/bulk-share")}
              sx={{
                backgroundColor: "#E31E24",
                "&:hover": {
                  backgroundColor: "#C41815",
                },
                whiteSpace: "nowrap",
              }}
            >
              Bulk Share
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ShareOutlinedIcon />}
              onClick={() => setShareOpen(true)}
              sx={{ whiteSpace: "nowrap", px: 3 }}
            >
              Share Case
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <CaseDetailHeader caseData={caseData} />
        </Box>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E2E6EF",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="fullWidth"
            sx={{
              bgcolor: "#FAFBFD",
              borderBottom: "1px solid #E2E6EF",
              minHeight: { xs: 56, sm: 64 },
              "& .MuiTab-root": {
                minHeight: { xs: 56, sm: 64 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                fontWeight: 600,
                textTransform: "none",
                color: "text.secondary",
                gap: 1,
                "&.Mui-selected": {
                  color: "primary.main",
                  bgcolor: "#FFFFFF",
                },
              },
              "& .MuiTabs-indicator": {
                height: 3,
                bgcolor: "#D4AF37",
              },
            }}
          >
            <Tab
              icon={<MicOutlinedIcon />}
              iconPosition="start"
              label="Voice Recording"
              {...tabA11yProps(0)}
            />
            <Tab
              icon={<SummarizeOutlinedIcon />}
              iconPosition="start"
              label="Conversation Summary"
              {...tabA11yProps(1)}
            />
            <Tab
              icon={<InfoOutlinedIcon />}
              iconPosition="start"
              label="Information Collected"
              {...tabA11yProps(2)}
            />
          </Tabs>

          <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, bgcolor: "#FFFFFF" }}>
            <TabPanel value={activeTab} index={0}>
              <VoiceRecordingTab recording={caseData.voiceRecording} caseId={caseData.id} />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <ConversationSummaryTab summary={caseData.conversationSummary} />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <InformationCollectedTab
                entities={caseData.extractedEntities}
                investigationDetails={caseData.investigationDetails}
                transcript={caseData.transcript}
              />
            </TabPanel>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mt: 3, py: 1 }}
        >
          © {new Date().getFullYear()} Delhi Police — Cyber Crime Unit. Authorized personnel only.
        </Typography>
      </Container>

      <ShareCaseDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        caseData={caseData}
      />
    </Box>
  );
}
