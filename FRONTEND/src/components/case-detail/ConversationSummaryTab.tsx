import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import { Box, Chip, Divider, Paper, Typography } from "@mui/material";
import type { ConversationSummary } from "../../types/case";

interface ConversationSummaryTabProps {
  summary: ConversationSummary;
}

export default function ConversationSummaryTab({ summary }: ConversationSummaryTabProps) {
  const generatedDate = new Date(summary.generatedAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
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
          bgcolor: "#FAFBFD",
          borderBottom: "1px solid #E2E6EF",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: "rgba(28, 35, 126, 0.08)",
              color: "primary.main",
            }}
          >
            <SummarizeOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              Conversation Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-assisted analysis of recorded conversation
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<AutoAwesomeOutlinedIcon sx={{ fontSize: "16px !important" }} />}
          label={`Confidence: ${summary.confidence}`}
          sx={{
            bgcolor: "rgba(212, 175, 55, 0.15)",
            color: "#1C237E",
            fontWeight: 600,
            border: "1px solid #D4AF37",
          }}
        />
      </Box>

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{
            lineHeight: 1.9,
            fontSize: { xs: "0.95rem", sm: "1rem" },
            textAlign: "justify",
          }}
        >
          {summary.summary}
        </Typography>

        <Divider sx={{ my: 2.5 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonOutlineOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              Analyst:{" "}
              <Typography component="span" variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                {summary.analyst}
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ScheduleOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              Generated:{" "}
              <Typography component="span" variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                {generatedDate}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
