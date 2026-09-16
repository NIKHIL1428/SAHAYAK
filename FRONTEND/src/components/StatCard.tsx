import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  accentColor: string;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-IN");
}

export default function StatCard({ title, value, icon, accentColor }: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        height: "100%",
        border: "1px solid #E2E6EF",
        borderTop: `4px solid ${accentColor}`,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(28, 35, 126, 0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500, mb: 0.5 }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              fontSize: { xs: "1.75rem", sm: "2rem" },
            }}
          >
            {formatNumber(value)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${accentColor}18`,
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}
