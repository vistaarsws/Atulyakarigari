import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";

const Payment = () => {
  return (
    <Box
      sx={{
        // minHeight: "100vh",
        display: "flex",
        // alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        // border: "2px solid red",
        // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        mr: { xs: 0 },

        // height: "75vh",
        // overflow: "scroll",
        height: { xs: "auto", md: "75vh" },
        overflow: "auto",
        scrollbarWidth: "none",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          // padding: 4,
          borderRadius: 2,
          boxShadow: 1,
          // maxWidth: "500px",
          // width: { md: "100%", lg: "500px" },
          padding: { xs: 2, md: 4 },
          // Full width on mobile, max-width on larger screens
          width: "100%",
        }}
      >
        <Box sx={{ marginBottom: 3 }}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "14px",
              color: "rgba(111, 111, 111, 1)",
              lineHeight: "25px",
            }}
          >
            Support Hardworking Artisans In India
          </Typography>
          {/* <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Donate and make a difference"
              sx={{
                ".MuiFormControlLabel-label": {
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "25px",
                  color: "rgb(56, 55, 55)",
                  backgroundColor: "fff",
                },
              }}
            />
          </Box> */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: 1,
              // No boxShadow property, so no shadow is applied
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  sx={{
                    color: "rgb(56, 55, 55)", // default color for unchecked state
                    "&.Mui-checked": {
                      color: "rgb(76, 175, 80)", // green color for the checkmark
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: 16, // adjust checkbox size to be smaller like the image
                      boxShadow: "none",
                    },
                  }}
                />
              }
              label="Donate and make a difference"
              sx={{
                ".MuiFormControlLabel-label": {
                  fontSize: "13px", // adjust font size to closely match the image
                  fontWeight: 400,
                  lineHeight: "25px",
                  color: "rgb(56, 55, 55)", // dark grey label color
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: 400,
                color: "#383737",
                borderColor: "#e2e2e2",
              }}
            >
              10
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: 400,
                color: "#383737",
                borderColor: "#e2e2e2",
              }}
            >
              20
            </Button>{" "}
            <Button
              variant="outlined"
              sx={{
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: 400,
                color: "#383737",
                borderColor: "#e2e2e2",
              }}
            >
              50
            </Button>{" "}
            <Button
              variant="outlined"
              sx={{
                borderRadius: "50px",
                fontSize: "14px",
                borderColor: "#e2e2e2",
                fontWeight: 400,
                color: "#383737",
              }}
            >
              100
            </Button>
          </Box>
        </Box>
        <Divider sx={{ marginY: 3 }} />
        <Box sx={{ marginBottom: 3 }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "25px",
              color: "rgba(56, 55, 55, 1)",
            }}
          >
            Price Details (6 items)
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "rgba(111, 111, 111, 1)",
                  lineHeight: "25px",
                }}
              >
                Total MRP
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "rgba(56, 55, 55, 1)",
                  lineHeight: "25px",
                }}
              >
                3,682
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                marginTop: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "rgba(111, 111, 111, 1)",
                  lineHeight: "25px",
                }}
              >
                Discount on MRP
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "rgba(96, 164, 135, 1)",
                  lineHeight: "25px",
                }}
              >
                -1,972
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                marginTop: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "rgba(111, 111, 111, 1)",
                  lineHeight: "25px",
                }}
              >
                Coupon Discount
              </Typography>
              <Typography
                sx={{
                  color: "rgba(173, 63, 56, 1)",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "25px",
                }}
              >
                Apply Coupon
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                marginTop: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "rgba(111, 111, 111, 1)",
                  lineHeight: "25px",
                }}
              >
                Shipping Fee
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "rgba(96, 164, 135, 1)",
                  lineHeight: "25px",
                }}
              >
                Free
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ marginY: 3 }} />
        <Box sx={{ marginBottom: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(56, 55, 55, 1)",
                lineHeight: "25px",
              }}
            >
              Total Amount
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "14px",
                color: "rgba(56, 55, 55, 1)",
                lineHeight: "25px",
              }}
            >
              8,663
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{
            width: "100%",
            backgroundColor: "rgba(96, 164, 135, 1)",
            color: "white",
            paddingY: 1.5,
            borderRadius: 1,
            textTransform: "capitalize",
            fontSize: "12px",
          }}
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );
};
export default Payment;