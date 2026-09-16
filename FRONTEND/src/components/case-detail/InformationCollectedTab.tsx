import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LocalPoliceOutlinedIcon from "@mui/icons-material/LocalPoliceOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { ExtractedEntities, InvestigationDetails } from "../../types/case";

interface InformationCollectedTabProps {
  entities: ExtractedEntities;
  investigationDetails: InvestigationDetails;
  transcript: string;
}

// ─────────────────────────────────────────────
// Investigation Details config
// ─────────────────────────────────────────────

interface InvField {
  key: keyof InvestigationDetails;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const investigationFields: InvField[] = [
  {
    key: "fraudType",
    label: "Fraud Type",
    icon: <ReportProblemOutlinedIcon fontSize="small" />,
    color: "#E31E24",
  },
  {
    key: "victimAction",
    label: "Victim Action",
    icon: <PersonOutlineOutlinedIcon fontSize="small" />,
    color: "#1C237E",
  },
  {
    key: "suspectAction",
    label: "Suspect Action",
    icon: <LocalPoliceOutlinedIcon fontSize="small" />,
    color: "#D4AF37",
  },
  {
    key: "moneyLost",
    label: "Money Lost",
    icon: <PaymentsOutlinedIcon fontSize="small" />,
    color: "#E31E24",
  },
  {
    key: "bankName",
    label: "Bank Name",
    icon: <AccountBalanceOutlinedIcon fontSize="small" />,
    color: "#1C237E",
  },
  {
    key: "finalOutcome",
    label: "Final Outcome",
    icon: <GavelOutlinedIcon fontSize="small" />,
    color: "#D4AF37",
  },
];

// ─────────────────────────────────────────────
// Extracted Entities config
// ─────────────────────────────────────────────

type EntityKey = keyof ExtractedEntities;

const entityConfig: Record<
  EntityKey,
  { label: string; icon: React.ReactNode; color: string }
> = {
  phoneNumbers: {
    label: "Phone Numbers",
    icon: <PhoneOutlinedIcon fontSize="small" />,
    color: "#1C237E",
  },
  upiIds: {
    label: "UPI IDs",
    icon: <WalletOutlinedIcon fontSize="small" />,
    color: "#E31E24",
  },
  transactionIds: {
    label: "Transaction IDs",
    icon: <ReceiptLongOutlinedIcon fontSize="small" />,
    color: "#D4AF37",
  },
  panNumbers: {
    label: "PAN Numbers",
    icon: <BadgeOutlinedIcon fontSize="small" />,
    color: "#1C237E",
  },
  aadhaarNumbers: {
    label: "Aadhaar Numbers",
    icon: <BadgeOutlinedIcon fontSize="small" />,
    color: "#E31E24",
  },
  bankAccounts: {
    label: "Bank Accounts",
    icon: <AccountBalanceOutlinedIcon fontSize="small" />,
    color: "#1C237E",
  },
  ifscCodes: {
    label: "IFSC Codes",
    icon: <AccountBalanceOutlinedIcon fontSize="small" />,
    color: "#D4AF37",
  },
  emails: {
    label: "Emails",
    icon: <EmailOutlinedIcon fontSize="small" />,
    color: "#E31E24",
  },
  urls: {
    label: "URLs",
    icon: <LanguageOutlinedIcon fontSize="small" />,
    color: "#1C237E",
  },
  amounts: {
    label: "Amounts",
    icon: <AttachMoneyOutlinedIcon fontSize="small" />,
    color: "#D4AF37",
  },
};

const entityOrder: EntityKey[] = [
  "phoneNumbers",
  "upiIds",
  "transactionIds",
  "panNumbers",
  "aadhaarNumbers",
  "bankAccounts",
  "ifscCodes",
  "emails",
  "urls",
  "amounts",
];

// ─────────────────────────────────────────────
// Section header helper
// ─────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  subtitle,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 1,
        mb: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      {badge}
    </Box>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export default function InformationCollectedTab({
  entities,
  investigationDetails,
  transcript,
}: InformationCollectedTabProps) {
  const [copied, setCopied] = useState(false);

  const totalEntities = entityOrder.reduce(
    (sum, key) => sum + entities[key].length,
    0
  );

  const handleCopyTranscript = () => {
    void navigator.clipboard.writeText(transcript).then(() => {
      setCopied(true);
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {/* ── Section 1: Investigation Details ── */}
      <Box>
        <SectionHeader
          icon={<ReportProblemOutlinedIcon />}
          title="Investigation Details"
          subtitle="Key facts extracted from the call analysis"
        />

        <Grid container spacing={2}>
          {investigationFields.map((field) => {
            const value = investigationDetails[field.key];
            const isAvailable =
              value !== "Not Available" && value !== "Not Mentioned";

            return (
              <Grid key={field.key} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: "100%",
                    border: "1px solid #E2E6EF",
                    borderTop: `3px solid ${field.color}`,
                    transition: "box-shadow 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(28, 35, 126, 0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: `${field.color}14`,
                        color: field.color,
                      }}
                    >
                      {field.icon}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "primary.main", fontWeight: 700 }}
                    >
                      {field.label}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isAvailable ? 600 : 400,
                      color: isAvailable ? "text.primary" : "text.secondary",
                      fontStyle: isAvailable ? "normal" : "italic",
                      wordBreak: "break-word",
                      lineHeight: 1.6,
                    }}
                  >
                    {value}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Divider />

      {/* ── Section 2: Extracted Entities ── */}
      <Box>
        <SectionHeader
          icon={<CreditCardOutlinedIcon />}
          title="Extracted Entities"
          subtitle="Automatically identified from call recording and complaint data"
          badge={
            <Chip
              icon={
                <CreditCardOutlinedIcon sx={{ fontSize: "16px !important" }} />
              }
              label={`${totalEntities} entities found`}
              sx={{
                bgcolor: "primary.main",
                color: "#FFFFFF",
                fontWeight: 600,
              }}
            />
          }
        />

        <Grid container spacing={2}>
          {entityOrder.map((key) => {
            const config = entityConfig[key];
            const values = entities[key];

            return (
              <Grid key={key} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: "100%",
                    border: "1px solid #E2E6EF",
                    borderTop: `3px solid ${config.color}`,
                    transition: "box-shadow 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(28, 35, 126, 0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: `${config.color}14`,
                        color: config.color,
                      }}
                    >
                      {config.icon}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "primary.main", fontWeight: 700 }}
                    >
                      {config.label}
                    </Typography>
                    <Chip
                      label={values.length}
                      size="small"
                      sx={{
                        ml: "auto",
                        height: 22,
                        fontWeight: 700,
                        bgcolor:
                          values.length > 0
                            ? `${config.color}18`
                            : "#F0F2F7",
                        color:
                          values.length > 0 ? config.color : "text.secondary",
                      }}
                    />
                  </Box>

                  {values.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      No entities detected
                    </Typography>
                  ) : (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {values.map((value, index) => (
                        <Box
                          key={index}
                          sx={{
                            px: 1.5,
                            py: 1,
                            bgcolor: "#FAFBFD",
                            borderRadius: 1,
                            border: "1px solid #E2E6EF",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              wordBreak: "break-all",
                              fontFamily:
                                key === "urls" || key === "transactionIds"
                                  ? "monospace"
                                  : "inherit",
                              fontSize: "0.8125rem",
                            }}
                          >
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Divider />

      {/* ── Section 3: Call Transcript ── */}
      <Box>
        <SectionHeader
          icon={<TextSnippetOutlinedIcon />}
          title="Call Transcript"
          subtitle="Full verbatim transcript of the recorded call"
          badge={
            <Tooltip title="Copy full transcript">
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyOutlinedIcon />}
                onClick={handleCopyTranscript}
                sx={{
                  borderColor: "#E2E6EF",
                  color: "primary.main",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "rgba(28, 35, 126, 0.04)",
                  },
                }}
              >
                Copy Transcript
              </Button>
            </Tooltip>
          }
        />

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E2E6EF",
            borderTop: "3px solid #1C237E",
            overflow: "hidden",
            transition: "box-shadow 0.2s",
            "&:hover": {
              boxShadow: "0 4px 16px rgba(28, 35, 126, 0.1)",
            },
          }}
        >
          {transcript && transcript.trim().length > 0 ? (
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                maxHeight: 480,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  fontFamily: "inherit",
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  lineHeight: 1.85,
                  color: "text.primary",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  m: 0,
                }}
              >
                {transcript}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                No transcript available for this case.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Copy success toast */}
      <Snackbar
        open={copied}
        autoHideDuration={2500}
        onClose={() => setCopied(false)}
        message="Transcript copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
