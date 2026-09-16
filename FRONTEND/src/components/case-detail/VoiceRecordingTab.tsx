import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import GraphicEqOutlinedIcon from "@mui/icons-material/GraphicEqOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { VoiceRecording } from "../../types/case";

interface VoiceRecordingTabProps {
  recording: VoiceRecording;
  caseId: string;
}

export default function VoiceRecordingTab({ recording, caseId }: VoiceRecordingTabProps) {
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const handleDownload = () => {
    if (recording.audioUrl) {
      const link = document.createElement("a");
      link.href = recording.audioUrl;
      link.download = recording.fileName;
      link.click();
      setShareNotice(`Download initiated: ${recording.fileName}`);
      return;
    }

    setShareNotice(`Download initiated: ${recording.fileName}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Delhi Police — Case Recording ${caseId}`,
      text: `Voice recording: ${recording.fileName} (${recording.duration})`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShareNotice("Case link copied to clipboard.");
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "#FAFBFD",
          border: "1px solid #E2E6EF",
          borderTop: "3px solid #1C237E",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
          <GraphicEqOutlinedIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            Voice Recording
          </Typography>
        </Box>

        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E6EF",
            borderRadius: 1,
            mb: 2.5,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
            {recording.fileName} · {recording.format} · {recording.duration}
          </Typography>

          <Box
            component="audio"
            controls
            sx={{
              width: "100%",
              height: 48,
              "&::-webkit-media-controls-panel": {
                bgcolor: "#FAFBFD",
              },
            }}
          >
            {recording.audioUrl && <source src={recording.audioUrl} type="audio/wav" />}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            {recording.audioUrl
              ? "Playback served from the backend recording endpoint."
              : "No recording is available for this case yet."}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadOutlinedIcon />}
            onClick={handleDownload}
            fullWidth
            sx={{ maxWidth: { sm: 200 } }}
          >
            Download
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ShareOutlinedIcon />}
            onClick={handleShare}
            fullWidth
            sx={{ maxWidth: { sm: 200 } }}
          >
            Share
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetaItem label="File Name" value={recording.fileName} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetaItem label="Duration" value={recording.duration} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetaItem label="Format" value={recording.format} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetaItem label="Assigned Analyst" value={recording.analyst} />
        </Grid>
      </Grid>

      <Snackbar
        open={Boolean(shareNotice)}
        autoHideDuration={4000}
        onClose={() => setShareNotice(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setShareNotice(null)}>
          {shareNotice}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #E2E6EF",
        borderRadius: 1,
        height: "100%",
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  );
}
