import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useState, useRef } from "react";
import { uploadCaseAudio } from "../api/cases";

interface UploadCaseDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadCaseDialog({ open, onClose, onSuccess }: UploadCaseDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      await uploadCaseAudio(file);
      setFile(null);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFile(null);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          m: 0,
          p: 0,
          bgcolor: "primary.main",
          background: "linear-gradient(135deg, #1C237E 0%, #141956 100%)",
          borderBottom: "3px solid #D4AF37",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CloudUploadIcon sx={{ color: "#D4AF37" }} />
            <Box>
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                Upload New Case
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
                Process an audio recording via the pipeline
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "#FFFFFF" }} disabled={uploading}>
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: "#FAFBFD" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Select an audio recording (WAV, MP3, M4A) to process. The pipeline will transcribe the audio, summarize the case, and extract entities automatically.
          </Typography>

          <Box
            sx={{
              border: "2px dashed #E2E6EF",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              bgcolor: "#FFFFFF",
              cursor: "pointer",
              "&:hover": { borderColor: "primary.main" },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".wav,.mp3,.m4a,.ogg,.flac,.webm,.mp4,.mpeg,.mpga"
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {file ? file.name : "Click to select audio file"}
            </Typography>
            {file && (
              <Typography variant="caption" color="text.secondary">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            )}
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
          {uploading && <Alert severity="info">Processing audio through pipeline (Whisper + Qwen)... This may take a minute.</Alert>}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#FFFFFF", borderTop: "1px solid #E2E6EF" }}>
        <Button onClick={handleClose} color="inherit" disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={() => void handleUpload()}
          variant="contained"
          disabled={!file || uploading}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
        >
          {uploading ? "Processing..." : "Process Case"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
