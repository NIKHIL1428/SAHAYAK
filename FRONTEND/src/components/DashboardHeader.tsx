import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";

export default function DashboardHeader() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #1C237E 0%, #141956 100%)",
        borderBottom: "3px solid #D4AF37",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: { xs: 1, sm: 1.5 }, gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: 44, sm: 52 },
              height: { xs: 44, sm: 52 },
              borderRadius: 1,
              bgcolor: "rgba(255,255,255,0.1)",
              border: "2px solid #D4AF37",
              flexShrink: 0,
            }}
          >
            <ShieldOutlinedIcon
              sx={{ fontSize: { xs: 28, sm: 32 }, color: "#D4AF37" }}
            />
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#D4AF37",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "block",
              }}
            >
              Government of NCT of Delhi
            </Typography>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.25rem" },
                lineHeight: 1.3,
              }}
            >
              Delhi Police — Cyber Analysis Portal
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.75)",
                display: { xs: "none", sm: "block" },
              }}
            >
              Cyber Crime Unit · Intelligence & Case Management Dashboard
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 0.25,
            }}
          >
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
              Last Updated
            </Typography>
            <Typography variant="body2" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Toolbar>
      </Container>
      <Divider sx={{ borderColor: "rgba(212, 175, 55, 0.3)" }} />
    </AppBar>
  );
}
