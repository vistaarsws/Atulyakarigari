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
import WAVES_IMG from "../../../../assets/images/footer-wave-effect.png";
import LEAFE_IMG from "../../../../assets/images/FooterLeafe.png";
import footerLogo from "../../../../assets/images/ATK Logo White_1.svg";

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
    width: "40%",
  },
}));

const ContentSection = styled(FlexItem)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    width: "60%",
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
          <FlexContainer
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo and Description */}
            <LogoSection>
              <Typography
                sx={{
                  fontSize: "1.4rem",
                  fontWeight: 500,
                  lineHeight: "1.3rem",
                }}
                gutterBottom
              >
                <figure style={{ marginRight: "30%" }}>
                  <img src={footerLogo} alt="Brand Logo" />
                </figure>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  fontWeight: 300,
                  fontSize: "1.4rem",
                  lineHeight: "2.2rem",
                  fontFamily: "lato",
                  mr: 2,
                }}
              >
                Atulya Karigari is putting its best to provide one stop
                corporate gifting solution to its client. Our custom made
                products are a token of personalized service in the most
                inspiring way possible.
              </Typography>
              <SocialIcons>
                {[
                  {
                    icon: Facebook,
                    link: "https://www.facebook.com/atulyakarigariindia",
                  },
                  {
                    icon: Twitter,
                    link: "https://twitter.com/atulyakarigari",
                  },
                  {
                    icon: Instagram,
                    link: "https://www.instagram.com/atulyakarigariindia/",
                  },
                  {
                    icon: YouTube,
                    link: "https://www.youtube.com/@atulyakarigariindia4005",
                  },
                ].map(({ icon: Icon, link }, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
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
                width: { sm: "100%", md: "60%" },
              }}
            >
              {/* Quick Links */}
              <ContentSection>
                <Typography
                  sx={{
                    fontSize: "1.4rem",
                    fontWeight: 500,
                    lineHeight: "1.3rem",
                    marginBottom: 2,
                  }}
                  gutterBottom
                >
                  Quick Links
                </Typography>
                <Box component="nav">
                  {[
                    { text: "Home", link: "/" },
                    { text: "About", link: "/about" },
                    { text: "Artisans", link: "/artisans" },
                    // { text: "Categories", link: "/categories" },
                  ].map(({ text, link }) => (
                    <QuickLink key={text} href={link}>
                      <StyledIcon component={ChevronRight} />
                      <Typography
                        sx={{
                          fontSize: "1.4rem",
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
                    fontSize: "1.4rem",
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
                        href="/blogs"
                        color="inherit"
                        underline="hover"
                        sx={{ display: "block", mb: 0.5 }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1.4rem",
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
                    fontSize: "1.4rem",
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
                    text: "Plot No 1215/1511; Khandagiri Bari, Ghatikiya, Khordha, Bhubaneswar-751030 Odisha (India)",
                    link: "https://maps.google.com/?q=Plot+No+1215/1511,+Khandagiri+Bari,+Bhubaneswar-751030",
                  },
                  {
                    Icon: Mail,
                    text: "atulyakarigariindia@gmail.com",
                    link: "mailto:atulyakarigariindia@gmail.com",
                  },
                  {
                    Icon: Phone,
                    text: "+91 9078077078",
                    link: "tel:+919078077078",
                  },
                ].map((item, index) => (
                  <ContactItem key={index}>
                    <StyledIcon component={item.Icon} />
                    <Typography
                      component="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontSize: "1.4rem",
                        fontWeight: 400,
                        fontFamily: "lato",
                        mb: 1,
                        textDecoration: "none", // Removes underline
                        color: "inherit", // Keeps text color same as before
                        "&:hover": { textDecoration: "underline" }, // Adds underline on hover
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
