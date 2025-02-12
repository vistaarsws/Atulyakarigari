import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const SkeletonLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        padding: 2,
        margin :3
      }}
    >
      {[...Array(6)].map((_, index) => (
        <Box key={index} sx={{ width: 200 }}>
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
