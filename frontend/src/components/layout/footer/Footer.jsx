import React from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Link,
  styled,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  ChevronRight,
  CalendarToday,
  LocationOn,
  Mail,
  Phone,
} from "@mui/icons-material";
import WAVES_IMG from "../../../assets/images/footer-wave-effect.png";
import LEAFE_IMG from "../../../assets/images/FooterLeafe.png";

// Styled components
const StyledFooter = styled("footer")(({ theme }) => ({
  backgroundColor: "#6D001D",
  color: "white",
  padding: theme.spacing(4, 0),
  position: "relative",
  fontFamily: "Arial, sans-serif",
}));

const FlexContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  margin: theme.spacing(0, -2),
  marginTop: 40,
}));

const FlexItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const LogoSection = styled(FlexItem)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
}));

const ContentSection = styled(FlexItem)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
}));

const SocialIcons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
}));

const QuickLink = styled(Link)(({ theme }) => ({
  color: "white",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  marginBottom: theme.spacing(2),
  "&:hover": {
    textDecoration: "underline",
  },
}));

const BlogPost = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(2),
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(1),
}));

const StyledIcon = styled(Box)(({ theme }) => ({
  color: "#60a487",
  marginRight: theme.spacing(1),
  fontSize: theme.typography.pxToRem(34),
}));

export default function Footer() {
  return (
    <>
      <StyledFooter>
        <Container>
          <FlexContainer sx={{ display: "flex" }}>
            {/* Logo and Description */}
            <LogoSection>
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: 500,
                  lineHeight: "1.3rem",
                }}
                gutterBottom
              >
                Logo
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  fontWeight: 300,
                  fontSize: "1.6rem",
                  lineHeight: "3rem",
                  fontFamily: "lato",
                }}
              >
                The proper Footer on proper time can preserve you protection. We
                assist you make sure every body forward. The proper Footer on
                proper time can preserve you protection. We assist you make sure
                every body forward. The proper Footer on proper time can
                preserve you protection. We assist you make sure every body
                forward.
              </Typography>
              <SocialIcons>
                {[Facebook, Twitter, Instagram, YouTube].map((Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      backgroundColor: "white",
                      color: "#6D001D",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </SocialIcons>
            </LogoSection>
            <Box
              sx={{
                display: { sm: "flex" },
                justifyContent: { sm: "space-between" },
                width: { sm: "100%", md: "50%" },
              }}
            >
              {/* Quick Links */}
              <ContentSection>
                <Typography
                  sx={{
                    fontSize: "1.6rem",
                    fontWeight: 500,
                    lineHeight: "1.3rem",
                    marginBottom: 2,
                  }}
                  gutterBottom
                >
                  Quick Link
                </Typography>
                <Box component="nav">
                  {["Home", "About Us", "Services", "Product"].map((text) => (
                    <QuickLink key={text} href="#">
                      <StyledIcon component={ChevronRight} />
                      <Typography
                        sx={{
                          fontSize: "1.6rem",
                          lineHeight: "1.3rem",
                          fontWeight: 400,
                          fontFamily: "lato",
                        }}
                      >
                        {text}
                      </Typography>
                    </QuickLink>
                  ))}
                </Box>
              </ContentSection>

              {/* Blog */}
              <ContentSection>
                <Typography
                  sx={{
                    fontSize: "1.6rem",
                    fontWeight: 500,
                    lineHeight: "1.3rem",
                    marginBottom: 2,
                  }}
                  gutterBottom
                >
                  Blog
                </Typography>
                {[1, 2].map((item) => (
                  <BlogPost key={item}>
                    <StyledIcon component={CalendarToday} />
                    <Box>
                      <Link
                        href="#"
                        color="inherit"
                        underline="hover"
                        sx={{ display: "block", mb: 0.5 }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1.6rem",
                            lineHeight: "1.9rem",
                            fontWeight: 500,
                            fontFamily: "lato",
                          }}
                        >
                          People Saying About
                        </Typography>
                      </Link>
                      <Typography
                        sx={{
                          fontSize: "1.3rem",
                          lineHeight: "1.3rem",
                          fontWeight: 400,
                          fontFamily: "lato",
                        }}
                      >
                        8 Nov, 2021
                      </Typography>
                    </Box>
                  </BlogPost>
                ))}
              </ContentSection>

              {/* Contact */}
              <ContentSection>
                <Typography
                  sx={{
                    fontSize: "1.6rem",
                    fontWeight: 500,
                    lineHeight: "1.3rem",
                    marginBottom: 2,
                  }}
                  gutterBottom
                >
                  Contact
                </Typography>
                {[
                  {
                    Icon: LocationOn,
                    text: "44 Danwers, NY City, USA, 70-102",
                  },
                  { Icon: Mail, text: "Lamaro@Lamaroyc.Us" },
                  { Icon: Phone, text: "91+585-656-658" },
                ].map((item, index) => (
                  <ContactItem key={index}>
                    <StyledIcon component={item.Icon} />
                    <Typography
                      sx={{
                        fontSize: "1.6rem",
                        fontWeight: 400,
                        fontFamily: "lato",
                        mb: 1,
                      }}
                    >
                      {item.text}
                    </Typography>
                  </ContactItem>
                ))}
              </ContentSection>
            </Box>
          </FlexContainer>
        </Container>
      </StyledFooter>
      <Box
        sx={{
          backgroundColor: "#6d001d",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "82px",
            backgroundImage: `url(${WAVES_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Typography
            variant="body1"
            align="center"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
            }}
          >
            &copy; 2023 All rights reserved
          </Typography>
        </Box>
      </Box>
    </>
  );
}
