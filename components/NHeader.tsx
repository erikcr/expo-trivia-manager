import { Box, Text } from "@gluestack-ui/themed";

export default function NHeader({ text }: { text: string }) {
  return (
    <Box
      w="$full"
      py="$2"
      alignItems="center"
      borderBottomWidth={1}
      sx={{
        _light: { borderColor: "$borderLight400" },
        _dark: { borderColor: "$borderDark900" },
      }}
    >
      <Text
        sx={{
          _light: { color: "$textLight800" },
          _dark: { borderColor: "$borderDark900" },
        }}
      >
        {text}
      </Text>
    </Box>
  );
}
