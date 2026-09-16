import { Box } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`case-tabpanel-${index}`}
      aria-labelledby={`case-tab-${index}`}
      sx={{ py: { xs: 2, sm: 3 } }}
    >
      {value === index && children}
    </Box>
  );
}

export function tabA11yProps(index: number) {
  return {
    id: `case-tab-${index}`,
    "aria-controls": `case-tabpanel-${index}`,
  };
}
