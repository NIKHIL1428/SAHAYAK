import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { mapShareItems, shareCasePackage } from "../api/share";
import type { CaseDetail } from "../types/case";
import {
  SHARE_DESTINATIONS,
  SHARE_ITEM_LABELS,
  type ShareableItem,
  type ShareDestination,
  type SharePriority,
} from "../types/share";

interface ShareCaseDialogProps {
  open: boolean;
  onClose: () => void;
  caseData: CaseDetail;
}

const ALL_ITEMS: ShareableItem[] = [
  "voiceRecording",
  "conversationSummary",
  "informationCollected",
];

function getPriorityColor(priority: SharePriority): string {
  switch (priority) {
    case "Normal":
      return "#1C237E";
    case "High":
      return "#D4AF37";
    case "Urgent":
      return "#E31E24";
  }
}

function formatCaseDate(isoString: string): string {
  return new Date(isoString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ShareCaseDialog({ open, onClose, caseData }: ShareCaseDialogProps) {
  const [selectedItems, setSelectedItems] = useState<ShareableItem[]>([...ALL_ITEMS]);
  const [destination, setDestination] = useState<ShareDestination>("Crime Branch");
  const [priority, setPriority] = useState<SharePriority>("Normal");
  const [remarks, setRemarks] = useState("");
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [forwardSuccess, setForwardSuccess] = useState(false);
  const [forwardError, setForwardError] = useState<string | null>(null);
  const [forwarding, setForwarding] = useState(false);

  const entityCount = useMemo(
    () =>
      Object.values(caseData.extractedEntities).reduce((sum, list) => sum + list.length, 0),
    [caseData.extractedEntities]
  );

  const handleToggleItem = (item: ShareableItem) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handlePreview = () => {
    setPreviewExpanded(true);
  };

  const handleForward = async () => {
    setForwarding(true);
    setForwardError(null);

    try {
      await shareCasePackage({
        case_id: caseData.id,
        destination,
        priority,
        remarks: remarks.trim() || undefined,
        ...mapShareItems(selectedItems),
      });
      setForwardSuccess(true);
      onClose();
    } catch (err) {
      setForwardError(err instanceof Error ? err.message : "Failed to forward case.");
    } finally {
      setForwarding(false);
    }
  };

  const handleClose = () => {
    setPreviewExpanded(false);
    onClose();
  };

  const canForward = selectedItems.length > 0 && destination;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              border: "1px solid #E2E6EF",
              overflow: "hidden",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 0,
            bgcolor: "primary.main",
            background: "linear-gradient(135deg, #1C237E 0%, #141956 100%)",
            borderBottom: "3px solid #D4AF37",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2, sm: 3 },
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <ShareOutlinedIcon sx={{ color: "#D4AF37" }} />
              <Box>
                <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                  Share Case
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
                  Forward case package to authorized unit
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} aria-label="Close" sx={{ color: "#FFFFFF" }}>
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#FAFBFD" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Case Information */}
              <Paper
                elevation={0}
                sx={{ p: 2, border: "1px solid #E2E6EF", borderLeft: "4px solid #1C237E" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <InfoOutlinedIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ color: "primary.main", fontWeight: 700 }}>
                    Case Information
                  </Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                  <InfoRow label="Case ID" value={caseData.id} />
                  <InfoRow label="Caller ID" value={caseData.callerId} />
                  <InfoRow label="Fraud Type" value={caseData.fraudType} />
                  <InfoRow label="District" value={caseData.district} />
                  <InfoRow label="Status" value={caseData.status} />
                  <InfoRow label="Registered" value={formatCaseDate(caseData.registeredAt)} />
                </Box>
              </Paper>

              {/* Items to include */}
              <Paper elevation={0} sx={{ p: 2, border: "1px solid #E2E6EF" }}>
                <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
                  Include in Package
                </Typography>
                <FormGroup>
                  {ALL_ITEMS.map((item) => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          checked={selectedItems.includes(item)}
                          onChange={() => handleToggleItem(item)}
                          sx={{
                            color: "primary.main",
                            "&.Mui-checked": { color: "primary.main" },
                          }}
                        />
                      }
                      label={SHARE_ITEM_LABELS[item]}
                      sx={{ "& .MuiFormControlLabel-label": { fontWeight: 500 } }}
                    />
                  ))}
                </FormGroup>
              </Paper>

              {/* Destination */}
              <FormControl fullWidth size="small">
                <InputLabel id="destination-label">Destination</InputLabel>
                <Select
                  labelId="destination-label"
                  value={destination}
                  label="Destination"
                  onChange={(e) => setDestination(e.target.value as ShareDestination)}
                  sx={{ bgcolor: "#FFFFFF" }}
                >
                  {SHARE_DESTINATIONS.map((dest) => (
                    <MenuItem key={dest} value={dest}>
                      {dest}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Priority */}
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ color: "text.primary", fontWeight: 700, fontSize: "0.875rem", mb: 0.5 }}
                >
                  Priority
                </FormLabel>
                <RadioGroup
                  row
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as SharePriority)}
                  sx={{ gap: { xs: 0, sm: 1 } }}
                >
                  {(["Normal", "High", "Urgent"] as SharePriority[]).map((level) => (
                    <FormControlLabel
                      key={level}
                      value={level}
                      control={
                        <Radio
                          sx={{
                            color: getPriorityColor(level),
                            "&.Mui-checked": { color: getPriorityColor(level) },
                          }}
                        />
                      }
                      label={level}
                      sx={{ mr: { xs: 2, sm: 3 } }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {/* Remarks */}
              <TextField
                label="Remarks"
                placeholder="Add forwarding instructions or context for receiving unit..."
                multiline
                rows={3}
                fullWidth
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                sx={{ bgcolor: "#FFFFFF" }}
              />
            </Box>

            {/* Package Preview */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #E2E6EF",
                  borderTop: `4px solid ${getPriorityColor(priority)}`,
                  height: "100%",
                  bgcolor: "#FFFFFF",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Inventory2OutlinedIcon sx={{ color: "primary.main" }} />
                  <Typography variant="subtitle1" sx={{ color: "primary.main", fontWeight: 700 }}>
                    Package Preview
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip
                    label={caseData.id}
                    size="small"
                    sx={{ fontFamily: "monospace", fontWeight: 600, bgcolor: "#F0F2F7" }}
                  />
                  <Chip
                    label={priority}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: `${getPriorityColor(priority)}18`,
                      color: getPriorityColor(priority),
                      border: `1px solid ${getPriorityColor(priority)}`,
                    }}
                  />
                  <Chip
                    label={destination}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: "block" }}>
                  SELECTED ITEMS ({selectedItems.length})
                </Typography>

                {selectedItems.length === 0 ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Select at least one item to include in the package.
                  </Alert>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                    {selectedItems.includes("voiceRecording") && (
                      <PreviewItem
                        label="Voice Recording"
                        detail={`${caseData.voiceRecording.fileName} · ${caseData.voiceRecording.duration}`}
                      />
                    )}
                    {selectedItems.includes("conversationSummary") && (
                      <PreviewItem
                        label="Conversation Summary"
                        detail={`Confidence ${caseData.conversationSummary.confidence} · ${caseData.conversationSummary.analyst}`}
                      />
                    )}
                    {selectedItems.includes("informationCollected") && (
                      <PreviewItem
                        label="Information Collected"
                        detail={`${entityCount} extracted entities across 9 categories`}
                      />
                    )}
                  </Box>
                )}

                {remarks && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: "block" }}>
                      REMARKS
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        p: 1.5,
                        bgcolor: "#FAFBFD",
                        borderRadius: 1,
                        border: "1px solid #E2E6EF",
                        lineHeight: 1.6,
                        ...(previewExpanded && { borderColor: "#D4AF37" }),
                      }}
                    >
                      {remarks}
                    </Typography>
                  </>
                )}

                {previewExpanded && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Package preview confirmed. Review contents above before forwarding.
                  </Alert>
                )}
              </Paper>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            bgcolor: "#FFFFFF",
            borderTop: "1px solid #E2E6EF",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            "& > :not(:first-of-type)": { ml: { xs: 0, sm: 1 } },
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{ maxWidth: { sm: 120 }, order: { xs: 3, sm: 0 }, mr: { sm: "auto !important" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePreview}
            variant="outlined"
            color="primary"
            startIcon={<PreviewOutlinedIcon />}
            disabled={selectedItems.length === 0}
            fullWidth
            sx={{ maxWidth: { sm: 180 } }}
          >
            Preview Package
          </Button>
          <Button
            onClick={() => void handleForward()}
            variant="contained"
            color="secondary"
            startIcon={<ForwardToInboxOutlinedIcon />}
            disabled={!canForward || forwarding}
            fullWidth
            sx={{ maxWidth: { sm: 180 } }}
          >
            {forwarding ? "Forwarding..." : "Forward Case"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={forwardSuccess}
        autoHideDuration={5000}
        onClose={() => setForwardSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setForwardSuccess(false)}
          sx={{ width: "100%" }}
        >
          Case {caseData.id} forwarded to {destination} with {priority} priority.
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(forwardError)}
        autoHideDuration={6000}
        onClose={() => setForwardError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setForwardError(null)}
          sx={{ width: "100%" }}
        >
          {forwardError}
        </Alert>
      </Snackbar>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
        {value}
      </Typography>
    </Box>
  );
}

function PreviewItem({ label, detail }: { label: string; detail: string }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        bgcolor: "#FAFBFD",
        borderRadius: 1,
        border: "1px solid #E2E6EF",
        borderLeft: "3px solid #D4AF37",
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {detail}
      </Typography>
    </Box>
  );
}
