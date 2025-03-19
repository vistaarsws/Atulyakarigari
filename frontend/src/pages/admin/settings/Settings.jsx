import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  AccountCircle,
  Home,
  AccountBalanceWallet,
  Edit,
  AdminPanelSettings,
  Search,
  PersonAdd,
  Delete,
} from "@mui/icons-material";
import {
  fetchProfile,
  fetchAllProfiles,
} from "../../../Redux/features/ProfileSlice";
import {
  addAdminThunk,
  removeAdminThunk,
} from "../../../Redux/features/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../../user/profile/profile/Profile";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";
import { getWallet } from "../../../services/admin/adminAPI";

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState("");
  const [address, setAddress] = useState({
    id: 1,
    name: "Home",
    line1: "123 Main Street",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    phone: "(212) 555-1234",
    isDefault: true,
  });

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [wallet, setWallet] = useState(null);

  const fetchWallet = async () => {
    const response = await getWallet();
    setWallet(response?.data?.message?.data);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleAddressDialog = () => {
    setAddressDialogOpen(true);
  };

  // Close address dialog
  const handleCloseAddressDialog = () => {
    setAddressDialogOpen(false);
  };

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const profile = useSelector((state) => state.profile.profile);
  const authToken = useSelector((state) => state.auth.token);

  const profiles = useSelector((state) => state.profile.profiles);

  const defaultProfilePicture = "/broken-image.jpg";
  const [formData, setFormData] = useState({});

  useEffect(() => {
    dispatch(fetchAllProfiles());
    dispatch(fetchProfile(authToken));
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      setUser(decodedToken);
    }
  }, [dispatch, authToken]);

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        profilePicture: profile.profilePicture || defaultProfilePicture,
      });
    }
  }, [profile]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Admin management functions
  const handleOpenAdminDialog = () => {
    setNewAdminEmail("");
    setAdminDialogOpen(true);
  };
  // 🔹 Filter only admin users
  const adminUsers = profiles?.filter(
    (profile) => profile.userId?.accountType === "admin"
  );

  // 🔍 Search functionality
  const filteredAdmins = adminUsers?.filter(
    (admin) =>
      admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseAdminDialog = () => {
    setAdminDialogOpen(false);
  };

  const handleOpenDeleteDialog = (admin) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedAdmin(null);
  };

  const handleDeleteAdmin = async () => {
    dispatch(removeAdminThunk({ email: selectedAdmin.email }))
      .unwrap()
      .then((response) => {
        enqueueSnackbar(response.message, { variant: "success" });
        setDeleteDialogOpen(false);
        dispatch(fetchAllProfiles());
      })
      .catch((error) => {
        enqueueSnackbar(error.message || "Failed to remove admin.", {
          variant: "error",
        });
      });
  };

  const handleSaveAdmin = () => {
    setAdminDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAddAdmin = async () => {
    dispatch(addAdminThunk({ email: newAdminEmail }))
      .unwrap()
      .then((response) => {
        enqueueSnackbar(response.message, { variant: "success" });
        setConfirmDialogOpen(false);
        dispatch(fetchAllProfiles());
      })
      .catch(() => {
        enqueueSnackbar( "Profile not found. Please sign up with this email.", {
          variant: "error",
        });
      });
  };

  return (
    <Container maxWidth="xl" sx={{}}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 3 }}>
        Account Settings
      </Typography>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", paddingBottom: 1 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                fontSize: "1.1rem", // Increase font size
                fontWeight: "bold", // Make text bold
                padding: "12px 20px", // Add more padding
                minHeight: "60px", // Increase tab height
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
              },
            }}
          >
            <Tab
              icon={<AccountCircle sx={{ fontSize: 20 }} />}
              label="Profile"
            />
            <Tab icon={<Home sx={{ fontSize: 20 }} />} label="Pickup Address" />
            <Tab
              icon={<AccountBalanceWallet sx={{ fontSize: 20 }} />}
              label="ShipRocket Wallet"
            />
            {user.role === "super-admin" && (
              <Tab
                icon={<AdminPanelSettings sx={{ fontSize: 20 }} />}
                label="Admin Management"
              />
            )}
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <Profile />
        </TabPanel>

        {/* ShipRocket Pickup Address Tab */}
        <TabPanel value={tabValue} index={1}>
          {/* Page Title */}
          <Box sx={{ m: 2, textAlign: "left" }}>
            <Typography variant="h5" fontWeight="bold">
              Manage ShipRocket Pickup Address
            </Typography>
          </Box>

          {/* Address Card */}
          <Card
            sx={{
              m: 2,
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              transition: "all 0.3s",
              "&:hover": { boxShadow: 6 },
              bgcolor: "background.paper",
            }}
          >
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                {/* Address Details */}
                <Grid item xs={12} sm={10}>
                  <Typography variant="h6" fontWeight="bold">
                    {address.name}
                  </Typography>

                  <Typography variant="subtitle1" color="text.primary">
                    {address.line1}
                  </Typography>
                  {address.line2 && (
                    <Typography variant="subtitle1" color="text.primary">
                      {address.line2}
                    </Typography>
                  )}
                  <Typography variant="subtitle1" color="text.secondary">
                    {address.city}, {address.state} {address.zip}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {address.country}
                  </Typography>

                  {/* Phone Number with Icon */}
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                    }}
                  >
                    📞 {address.phone}
                  </Typography>
                </Grid>

                {/* Edit Button */}
                <Grid item xs={12} sm={2} textAlign="right">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={handleAddressDialog}
                    sx={{
                      bgcolor: "primary.light",
                      color: "primary.dark",
                      borderRadius: "50%",
                      boxShadow: 2,
                      transition: "all 0.3s",
                      "&:hover": {
                        bgcolor: "primary.dark",
                        color: "white",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* ShipRocket Wallet Tab */}
        <TabPanel value={tabValue} index={2}>
          {/* Wallet Balance Section */}
          <Box
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: "2vw",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                ShipRocket Wallet Balance
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccountBalanceWallet
                  sx={{ fontSize: 50, mr: 2, color: "primary.main" }}
                />
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  ₹{wallet?.balance_amount}
                </Typography>
              </Box>
            </CardContent>
          </Box>
        </TabPanel>

        {/* Admin Management Tab - Only visible to Super Admin */}
        {user.role === "super-admin" && (
          <TabPanel value={tabValue} index={3}>
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Admin Management
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Create and manage admin accounts. Only super admins have access
                to this section.
              </Typography>
            </Box>

            {/* Search & Add Button Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, // Column on mobile, row on larger screens
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2, // Adds spacing for mobile view
                mb: 3,
              }}
            >
              <TextField
                placeholder="Search admins..."
                size="small"
                fullWidth // Full width on small screens
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ maxWidth: { sm: "60%", md: "50%" } }} // Responsive width control
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={handleOpenAdminDialog}
                sx={{
                  width: { xs: "100%", sm: "auto" }, // Full width button on mobile
                }}
              >
                Add New Admin
              </Button>
            </Box>

            {/* No Admins Found Message */}
            {filteredAdmins.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2, textAlign: "center" }}>
                No admin accounts found matching your search.
              </Alert>
            ) : (
              /* Admin List */
              <List
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 2,
                  overflow: "hidden",
                }}
              >
                {filteredAdmins.map((admin) => (
                  <ListItem
                    key={admin.id}
                    divider
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleOpenDeleteDialog(admin)}
                        color="error"
                        sx={{
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "scale(1.1)" },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={admin.profilePicture || "/default-avatar.png"}
                        sx={{
                          width: 48,
                          height: 48,
                          border: "2px solid",
                          borderColor: "primary.light",
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="bold">
                          {admin.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {admin.email}
                          </Typography>
                          {" — "}
                          {admin?.userId?.accountType}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
        )}
      </Paper>

      {/* Address Dialog */}
      <Dialog
        open={addressDialogOpen}
        onClose={handleCloseAddressDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Address Name (e.g. Home, Office)"
            type="text"
            fullWidth
            defaultValue={address.name}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Address Line 1"
            type="text"
            fullWidth
            defaultValue={address.line1}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Address Line 2 (Optional)"
            type="text"
            fullWidth
            defaultValue={address.line2}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="City"
                type="text"
                fullWidth
                defaultValue={address.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="State/Province"
                type="text"
                fullWidth
                defaultValue={address.state}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Postal/ZIP Code"
                type="text"
                fullWidth
                defaultValue={address.zip}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Country"
                type="text"
                fullWidth
                defaultValue={address.country}
              />
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            defaultValue={address.phone}
            sx={{ mb: 1, mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseAddressDialog}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Address Dialog */}
      <Dialog
        open={addressDialogOpen}
        onClose={handleCloseAddressDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Address Name (e.g. Home, Office)"
            type="text"
            fullWidth
            defaultValue={address.name}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Address Line 1"
            type="text"
            fullWidth
            defaultValue={address.line1}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Address Line 2 (Optional)"
            type="text"
            fullWidth
            defaultValue={address.line2}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="City"
                type="text"
                fullWidth
                defaultValue={address.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="State/Province"
                type="text"
                fullWidth
                defaultValue={address.state}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Postal/ZIP Code"
                type="text"
                fullWidth
                defaultValue={address.zip}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Country"
                type="text"
                fullWidth
                defaultValue={address.country}
              />
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            defaultValue={address.phone}
            sx={{ mb: 1, mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              enqueueSnackbar("Address updated successfully!", {
                variant: "success",
              });
              handleCloseAddressDialog();
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Admin Dialog */}
      <Dialog
        open={adminDialogOpen}
        onClose={handleCloseAdminDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Admin Account</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the email address for the new admin account.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdminDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSaveAdmin();
            }}
            disabled={!newAdminEmail || !newAdminEmail.includes("@")}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Add Admin */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Add Admin</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to add {newAdminEmail} as an admin?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleConfirmAddAdmin();
            }}
          >
            Yes, Add Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Admin Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Admin Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Demote{" "}
            <span style={{ fontWeight: "bold", color: "black" }}>
              {selectedAdmin?.fullName}
            </span>{" "}
            from an admin to a customer?.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteAdmin();
            }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3.5 }}>{children}</Box>}
    </div>
  );
}
