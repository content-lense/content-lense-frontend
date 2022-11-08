// INFO: This File is translated
import { Box, CircularProgress } from "@mui/material";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: "50px",
        }}
      >
        <Box
          sx={{
            width: 160,
            height: 40,
            position: "relative",
            cursor: "pointer",
          }}
        >
          <Image layout="fill" objectFit="contain" alt={"Content Lense"} src="/images/logo.png" />
        </Box>
        <CircularProgress />
      </div>
    </>
  );
}
