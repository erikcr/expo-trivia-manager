import { ReactNode } from "react";
import { Box } from "@gluestack-ui/themed";

export default function NContentHeader({ children }: { children: ReactNode }) {
  return (
    <Box
      w="$full"
      py="$2"
      px="$8"
      borderBottomWidth={1}
      sx={{
        _light: { borderColor: "$borderLight400" },
        _dark: { borderColor: "$borderDark900" },
      }}
    >
      {children}
    </Box>
  );
}
