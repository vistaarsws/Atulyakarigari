import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

const SkeletonLoader = () => {
  // Breakpoints matching ProductSection's slider
  const isXS = useMediaQuery("(max-width: 600px)"); // 2 slides
  const isSM = useMediaQuery("(max-width: 960px)"); // ~2.5 slides
  const isMD = useMediaQuery("(max-width: 1280px)"); // 3.5 slides
  const isLG = useMediaQuery("(max-width: 1440px)"); // 5 slides
  const isXL = useMediaQuery("(min-width: 1441px)"); // 5.5 slides

  // Dynamic width based on screen size
  const cardWidth = isXS
    ? "32%" // Ensures exactly 2 cards fit in 320px
    : isSM
    ? "32%" // ~2.5 slides
    : isMD
    ? "24%" // 3.5 slides
    : isLG
    ? "18%" // 5 slides
    : "16%"; // 5.5 slides

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 2,
        padding: 2,
        margin: "auto",
        maxWidth: "1440px",
      }}
    >
      {[...Array(6)].map((_, index) => (
        <Box
          key={index}
          sx={{
            width: cardWidth,
            minWidth: "140px", // Allows 2 cards at 320px
            maxWidth: "320px",
          }}
        >
          {/* Image Skeleton */}
          <Skeleton variant="rectangular" width="100%" height={180} />
          {/* Text Skeletons */}
          <Skeleton variant="text" sx={{ marginTop: 1, width: "80%" }} />
          <Skeleton variant="text" sx={{ width: "60%" }} />
        </Box>
      ))}
    </Box>
  );
};

export default SkeletonLoader;
