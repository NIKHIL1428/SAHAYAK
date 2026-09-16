import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  FileDownload,
  Preview as PreviewIcon,
  Send,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';

// Mock API service
const bulkShareService = {
  // Simulate fetching cases based on filters
  fetchCasesData: async (_filters: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          casesFound: Math.floor(Math.random() * 150) + 50,
          audioSize: Math.floor(Math.random() * 2500) + 500,
          summaries: Math.floor(Math.random() * 80) + 20,
          dataFiles: Math.floor(Math.random() * 200) + 50,
        });
      }, 1500);
    });
  },

  // Simulate generating report
  generateReport: async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a sample CSV report
        const reportData = `Date Range: ${data.dateRange}\nFraud Types: ${data.fraudTypes.join(', ')}\nCases Found: ${data.preview.casesFound}\nTotal Audio Size: ${data.preview.audioSize} MB\nTotal Summaries: ${data.preview.summaries}\nTotal Data Files: ${data.preview.dataFiles}`;
        const blob = new Blob([reportData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulk_share_report_${new Date().getTime()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        resolve({ success: true });
      }, 2000);
    });
  },

  // Simulate forwarding package
  forwardPackage: async (data: any) => {
    return new Promise((resolve: (value: any) => void) => {
      setTimeout(() => {
        console.log('Forwarding package:', data);
        resolve({
          success: true,
          message: `Package successfully forwarded to ${data.destination}`,
          trackingId: `PKG-${Date.now()}`,
        });
      }, 2500);
    });
  },
};

interface PreviewData {
  casesFound: number;
  audioSize: number;
  summaries: number;
  dataFiles: number;
}

interface NotificationState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

const BulkSharePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [dateRange, setDateRange] = useState('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [fraudFilters, setFraudFilters] = useState({
    all: true,
    upi: false,
    otp: false,
    kyc: false,
    phishing: false,
  });
  const [contentSelection, setContentSelection] = useState({
    voice: false,
    summaries: false,
    data: false,
  });
  const [destination, setDestination] = useState('');
  const [priority, setPriority] = useState('normal');
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    type: 'info',
  });
  const [previewDialog, setPreviewDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleDateRangeChange = (event: any) => {
    setDateRange(event.target.value as string);
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const handleFraudFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    if (name === 'all') {
      setFraudFilters({
        all: checked,
        upi: checked,
        otp: checked,
        kyc: checked,
        phishing: checked,
      });
    } else {
      const updated = { ...fraudFilters, [name]: checked };
      const allSelected = updated.upi && updated.otp && updated.kyc && updated.phishing;
      setFraudFilters({
        ...updated,
        all: allSelected,
      });
    }
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setContentSelection({
      ...contentSelection,
      [name]: checked,
    });
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({
      open: true,
      message,
      type,
    });
    setTimeout(() => {
      setNotification({ ...notification, open: false });
    }, 5000);
  };

  const handlePreviewPackage = async () => {
    // Validation
    if (!destination) {
      showNotification('Please select a destination', 'error');
      return;
    }

    const selectedContent = Object.values(contentSelection).some((v) => v);
    if (!selectedContent) {
      showNotification('Please select at least one content type', 'error');
      return;
    }

    setLoading(true);
    try {
      const previewData = await bulkShareService.fetchCasesData({
        dateRange,
        customStartDate,
        customEndDate,
        fraudFilters,
        contentSelection,
        destination,
      });
      setPreview(previewData as PreviewData);
      setPreviewDialog(true);
      showNotification('Package preview loaded successfully', 'success');
    } catch (error) {
      showNotification('Failed to load package preview', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!preview) {
      showNotification('Please preview package first', 'error');
      return;
    }

    setLoading(true);
    try {
      const selectedFraudTypes = Object.entries(fraudFilters)
        .filter(([key, value]) => value && key !== 'all')
        .map(([key]) => key);

      await bulkShareService.generateReport({
        dateRange,
        fraudTypes: selectedFraudTypes.length > 0 ? selectedFraudTypes : ['All'],
        preview,
      });
      showNotification('Report generated and downloaded successfully', 'success');
    } catch (error) {
      showNotification('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForwardPackage = async () => {
    // Validation
    if (!preview) {
      showNotification('Please preview package first', 'error');
      return;
    }

    if (!destination) {
      showNotification('Please select a destination', 'error');
      return;
    }

    setLoading(true);
    try {
      const selectedContent = Object.entries(contentSelection)
        .filter(([, value]) => value)
        .map(([key]) => key);

      const result: any = await bulkShareService.forwardPackage({
        dateRange,
        fraudFilters,
        contentSelection: selectedContent,
        destination,
        priority,
        preview,
      });

      showNotification(
        `Success! ${result.message}\nTracking ID: ${result.trackingId}`,
        'success'
      );

      // Reset form after successful submission
      setTimeout(() => {
        setFraudFilters({ all: true, upi: false, otp: false, kyc: false, phishing: false });
        setContentSelection({ voice: false, summaries: false, data: false });
        setDestination('');
        setPriority('normal');
        setPreview(null);
        setPreviewDialog(false);
      }, 2000);
    } catch (error) {
      showNotification('Failed to forward package', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedFraudCount = Object.entries(fraudFilters)
    .filter(([key, value]) => value && key !== 'all')
    .length;

  const selectedContentCount = Object.values(contentSelection).filter((v) => v).length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundGradient: 'linear-gradient(135deg, #f0f2f7 0%, #e8ebf2 100%)',
        backgroundColor: '#f0f2f7',
        p: isMobile ? 1 : 3,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1C237E',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CloudUpload sx={{ fontSize: 32 }} />
            Bulk Data Forwarding
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Select filters, review package details, and forward bulk data to designated
            destinations
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {/* Main Form Section */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 2 : 3,
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Stack spacing={3}>
                {/* Date Range Section */}
                <Box>
                  <Typography variant="h6" sx={{ color: '#1C237E', fontWeight: 600, mb: 2 }}>
                    Date Range
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Select Period</InputLabel>
                    <Select value={dateRange} onChange={handleDateRangeChange} label="Select Period">
                      <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="yesterday">Yesterday</MenuItem>
                      <MenuItem value="last7">Last 7 Days</MenuItem>
                      <MenuItem value="last30">Last 30 Days</MenuItem>
                      <MenuItem value="custom">Custom Range</MenuItem>
                    </Select>
                  </FormControl>

                  {dateRange === 'custom' && (
                    <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mt: 2 }}>
                      <TextField
                        label="Start Date"
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        fullWidth={isMobile}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <TextField
                        label="End Date"
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        fullWidth={isMobile}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Stack>
                  )}
                </Box>

                <Divider />

                {/* Fraud Type Filters */}
                <Box>
                  <Typography variant="h6" sx={{ color: '#1C237E', fontWeight: 600, mb: 2 }}>
                    Fraud Type Filters {selectedFraudCount > 0 && `(${selectedFraudCount})`}
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={fraudFilters.all}
                          onChange={handleFraudFilterChange}
                          name="all"
                          sx={{
                            color: '#1C237E',
                            '&.Mui-checked': { color: '#E31E24' },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontWeight: 600 }}>All Fraud Types</Typography>
                      }
                    />

                    <Box sx={{ ml: 2, mt: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fraudFilters.upi}
                            onChange={handleFraudFilterChange}
                            name="upi"
                            disabled={fraudFilters.all}
                            sx={{
                              color: '#1C237E',
                              '&.Mui-checked': { color: '#E31E24' },
                            }}
                          />
                        }
                        label="UPI Fraud"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fraudFilters.otp}
                            onChange={handleFraudFilterChange}
                            name="otp"
                            disabled={fraudFilters.all}
                            sx={{
                              color: '#1C237E',
                              '&.Mui-checked': { color: '#E31E24' },
                            }}
                          />
                        }
                        label="OTP Fraud"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fraudFilters.kyc}
                            onChange={handleFraudFilterChange}
                            name="kyc"
                            disabled={fraudFilters.all}
                            sx={{
                              color: '#1C237E',
                              '&.Mui-checked': { color: '#E31E24' },
                            }}
                          />
                        }
                        label="KYC Fraud"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fraudFilters.phishing}
                            onChange={handleFraudFilterChange}
                            name="phishing"
                            disabled={fraudFilters.all}
                            sx={{
                              color: '#1C237E',
                              '&.Mui-checked': { color: '#E31E24' },
                            }}
                          />
                        }
                        label="Phishing"
                      />
                    </Box>
                  </FormGroup>
                </Box>

                <Divider />

                {/* Content Selection */}
                <Box>
                  <Typography variant="h6" sx={{ color: '#1C237E', fontWeight: 600, mb: 2 }}>
                    Content Selection {selectedContentCount > 0 && `(${selectedContentCount})`}
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={contentSelection.voice}
                          onChange={handleContentChange}
                          name="voice"
                          sx={{
                            color: '#1C237E',
                            '&.Mui-checked': { color: '#E31E24' },
                          }}
                        />
                      }
                      label="Voice Recordings"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={contentSelection.summaries}
                          onChange={handleContentChange}
                          name="summaries"
                          sx={{
                            color: '#1C237E',
                            '&.Mui-checked': { color: '#E31E24' },
                          }}
                        />
                      }
                      label="Conversation Summaries"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={contentSelection.data}
                          onChange={handleContentChange}
                          name="data"
                          sx={{
                            color: '#1C237E',
                            '&.Mui-checked': { color: '#E31E24' },
                          }}
                        />
                      }
                      label="Extracted Data"
                    />
                  </FormGroup>
                </Box>

                <Divider />

                {/* Destination and Priority */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Destination</InputLabel>
                      <Select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        label="Destination"
                      >
                        <MenuItem value="">-- Select Destination --</MenuItem>
                        <MenuItem value="south_delhi">South Delhi</MenuItem>
                        <MenuItem value="dwarka">Dwarka</MenuItem>
                        <MenuItem value="rohini">Rohini</MenuItem>
                        <MenuItem value="crime_branch">Crime Branch</MenuItem>
                        <MenuItem value="headquarters">Headquarters</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select value={priority} onChange={(e) => setPriority(e.target.value)} label="Priority">
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="urgent">Urgent</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, pt: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                  <Button
                    variant="outlined"
                    startIcon={<PreviewIcon />}
                    onClick={handlePreviewPackage}
                    disabled={loading || !destination}
                    fullWidth={isMobile}
                    sx={{
                      color: '#1C237E',
                      borderColor: '#1C237E',
                      '&:hover': {
                        backgroundColor: '#f0f2f7',
                        borderColor: '#1C237E',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Preview Package'}
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<FileDownload />}
                    onClick={handleGenerateReport}
                    disabled={loading || !preview}
                    fullWidth={isMobile}
                    sx={{
                      color: '#D4AF37',
                      borderColor: '#D4AF37',
                      '&:hover': {
                        backgroundColor: '#fef8e7',
                        borderColor: '#D4AF37',
                      },
                    }}
                  >
                    Generate Report
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={handleForwardPackage}
                    disabled={loading || !preview || !destination}
                    fullWidth={isMobile}
                    sx={{
                      backgroundColor: '#E31E24',
                      '&:hover': {
                        backgroundColor: '#C41815',
                      },
                      '&:disabled': {
                        backgroundColor: '#ccc',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Forward Package'}
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Preview Panel - Sticky */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                position: isTablet ? 'relative' : 'sticky',
                top: isTablet ? 'auto' : 20,
              }}
            >
              <Card
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 2,
                  border: '2px solid #E31E24',
                  boxShadow: '0 4px 12px rgba(227, 30, 36, 0.15)',
                }}
              >
                <CardHeader
                  title="Package Preview"
                  titleTypographyProps={{
                    variant: 'h6',
                    sx: { color: '#1C237E', fontWeight: 700 },
                  }}
                  sx={{ backgroundColor: '#f0f2f7', borderBottom: '1px solid #e0e0e0' }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    {preview ? (
                      <>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: '#f0f2f7',
                            borderRadius: 1,
                            border: '1px solid #ddd',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 600, color: '#333' }}>
                              Cases Found
                            </Typography>
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{ color: '#E31E24', fontWeight: 700, ml: 3.5 }}
                          >
                            {preview.casesFound}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: '#f0f2f7',
                            borderRadius: 1,
                            border: '1px solid #ddd',
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                            Total Audio Size
                          </Typography>
                          <Typography sx={{ color: '#E31E24', fontWeight: 700, ml: 1 }}>
                            {preview.audioSize} MB
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: '#f0f2f7',
                            borderRadius: 1,
                            border: '1px solid #ddd',
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                            Total Summaries
                          </Typography>
                          <Typography sx={{ color: '#E31E24', fontWeight: 700, ml: 1 }}>
                            {preview.summaries}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: '#f0f2f7',
                            borderRadius: 1,
                            border: '1px solid #ddd',
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                            Total Data Files
                          </Typography>
                          <Typography sx={{ color: '#E31E24', fontWeight: 700, ml: 1 }}>
                            {preview.dataFiles}
                          </Typography>
                        </Box>

                        <Alert severity="success">
                          Package is ready to forward to <strong>{destination}</strong>
                        </Alert>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <PreviewIcon
                          sx={{ fontSize: 48, color: '#ccc', mb: 2 }}
                        />
                        <Typography sx={{ color: '#999', mb: 1 }}>
                          No package previewed yet
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#bbb' }}>
                          Click "Preview Package" to load details
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Notification */}
      {notification.open && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            animation: 'slideUp 0.3s ease-in-out',
            '@keyframes slideUp': {
              from: { transform: 'translateY(100px)', opacity: 0 },
              to: { transform: 'translateY(0)', opacity: 1 },
            },
          }}
        >
          <Alert
            severity={notification.type}
            icon={
              notification.type === 'error' ? (
                <ErrorIcon />
              ) : notification.type === 'success' ? (
                <CheckCircle />
              ) : undefined
            }
            sx={{
              minWidth: isMobile ? '90vw' : 400,
              backgroundColor:
                notification.type === 'success'
                  ? '#E8F5E9'
                  : notification.type === 'error'
                    ? '#FFEBEE'
                    : '#E3F2FD',
              color:
                notification.type === 'success'
                  ? '#2E7D32'
                  : notification.type === 'error'
                    ? '#C62828'
                    : '#1565C0',
              fontWeight: 500,
            }}
          >
            {notification.message}
          </Alert>
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
        slotProps={{
          backdrop: {
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          },
        }}
      >
        <DialogTitle sx={{ color: '#1C237E', fontWeight: 700 }}>
          Package Summary
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {preview && (
              <>
                <Typography>
                  <strong>Cases Found:</strong> {preview.casesFound}
                </Typography>
                <Typography>
                  <strong>Audio Size:</strong> {preview.audioSize} MB
                </Typography>
                <Typography>
                  <strong>Summaries:</strong> {preview.summaries}
                </Typography>
                <Typography>
                  <strong>Data Files:</strong> {preview.dataFiles}
                </Typography>
                <Typography>
                  <strong>Destination:</strong> {destination}
                </Typography>
                <Typography>
                  <strong>Priority:</strong> {priority.toUpperCase()}
                </Typography>
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Wrapper component to add proper Container
const Container: React.FC<{ maxWidth: 'xl' | 'lg' | 'md'; children: React.ReactNode }> = ({ maxWidth, children }) => (
  <Box
    sx={{
      maxWidth: maxWidth === 'xl' ? 1400 : maxWidth === 'lg' ? 1200 : 900,
      mx: 'auto',
      width: '100%',
    }}
  >
    {children}
  </Box>
);

export default BulkSharePage;
