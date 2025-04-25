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
  Skeleton,
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
 Add
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
import {
  Change_Address,
  getWalletData,
  get_Address,getWallet
} from "../../../services/admin/adminAPI";

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
  const getData = async (authToken) => {
    try {
      const data = await getWalletData(authToken);
      setBalance(data.data);
      console.log(balance.message.data.balance_amount, "data");
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };
  const profiles = useSelector((state) => state.profile.profiles);

  const defaultProfilePicture = "/broken-image.jpg";
  const [formData, setFormData] = useState({});
  const [balance, setBalance] = useState();
  const [adminAddress, setAdminAddress] = useState();
  const [editAddress, setEditAddress] = useState({
    name: address.name || "",
    line1: address.line1 || "",
    line2: address.line2 || "",
    city: address.city || "",
    state: address.state || "",
    zip: address.zip || "",
    country: address.country || "",
    phone: address.phone || "",
  });

  const handleSubmit = async () => {
    try {
      if (
        !formData.name ||
        !formData.line1 ||
        !formData.city ||
        !formData.state ||
        !formData.zip ||
        !formData.country ||
        !formData.phone
      ) {
        enqueueSnackbar("Please fill in all required fields.", {
          variant: "warning",
        });
        return;
      }

    const data = {
      pickupdata: {
        pickup_location: formData.name,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.line1,
        address_2: formData.line2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pin_code: formData.zip,
      },
    };

    // ✅ Send the object directly, not wrapped in `pickupdata`
    await Change_Address(authToken, data);

    getAdminAddress();
    enqueueSnackbar("Address updated successfully!", { variant: "success" });
    handleCloseAddressDialog();
  } catch (error) {
    console.error("Error updating address:", error);
    enqueueSnackbar("Failed to update address.", { variant: "error" });
  }
};

//add api

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


  useEffect(() => {
    getAdminAddress();
    getData();

  }, [authToken]);

  const getAdminAddress = async (authToken) => {
    try {
      const data = await get_Address(authToken);
      setAdminAddress(data);
      console.log(adminAddress, "data");
    } catch (error) {
      console.error("Error fetching Address:", error);
    }
  };

  useEffect(() => {
    getAdminAddress();
    getData();
  }, [authToken]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // const handleSubmit = async () => {
  //   try {
  //     console.log()
  //     // Replace with your API call
  //     Change_Address(authToken,Change_Address);
  //     await onSubmit(formData); // or call fetch/axios here
  //     console.log("Address submitted:", formData);
  //   } catch (error) {
  //     console.error("API Error:", error);
  //   }
  // };

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
          <Grid item xs={12} sm={2} textAlign="right">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddressDialog}
              sx={{
                bgcolor: "primary.light",
                color: "primary.dark",
                borderRadius: "25px",
                boxShadow: 2,
                textTransform: "none",
                px: 2,
                py: 1,
                transition: "all 0.3s",
                whiteSpace: "nowrap", // prevents button from breaking text
                "&:hover": {
                  bgcolor: "primary.dark",
                  color: "white",
                  boxShadow: 4,
                },
              }}
            >
              Add Address
            </Button>
          </Grid>

          {/* Address Card */}
          {adminAddress != null ? (
            adminAddress?.message?.map((item, index) => (
              <Card
                key={index}
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
                        {item.name}
                      </Typography>

                      <Typography variant="subtitle1" color="text.primary">
                        {item.address}
                      </Typography>

                      {item.address_2 && (
                        <Typography variant="subtitle1" color="text.primary">
                          {item.address_2}
                        </Typography>
                      )}

                      <Typography variant="subtitle1" color="text.secondary">
                        {item.city}, {item.state} {item.pin_code}
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                        {item.country}
                      </Typography>

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
                        📞 {item.phone}
                      </Typography>
                    </Grid>

                    {/* Edit Button */}
                  </Grid>
                </CardContent>
              </Card>
            ))
          ) : (
            <Skeleton variant="text" width={400} height={50} />
          )}
        </TabPanel>

        {/* ShipRocket Wallet Tab */}
        <TabPanel value={tabValue} index={2}>
          {/* Wallet Balance Section */}
          <Box
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              boxShadow: 4,
              transition: "all 0.3s",
              "&:hover": { boxShadow: 6 },
              bgcolor: "background.paper", border: "1px solid #e0e0e0",
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                ShipRocket Wallet Balance
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: 2,
                  // bgcolor: "primary.light",
                  boxShadow: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccountBalanceWallet
                    sx={{ fontSize: 50, mr: 2, color: "primary.main" }}
                  />
                  <Typography
                    variant="h3"
                    color="primary.main"
                    fontWeight="bold"
                  >
                    ₹4,250.75
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Last updated: Today at 10:45 AM
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
                Create and manage admin accounts. Only super admins
                have access to this section.
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
            value={formData.name}
            onChange={handleChange("name")}
            sx={{ mb: 2, mt: 1 }}
            required
          />
          <TextField
            margin="dense"
            label="Address Line 1"
            type="text"
            fullWidth
            value={formData.line1}
            onChange={handleChange("line1")}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            label="Address Line 2 (Optional)"
            type="text"
            fullWidth
            value={formData.line2}
            onChange={handleChange("line2")}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="City"
                type="text"
                fullWidth
                value={formData.city}
                onChange={handleChange("city")}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="State/Province"
                type="text"
                fullWidth
                value={formData.state}
                onChange={handleChange("state")}
                required
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
                value={formData.zip}
                onChange={handleChange("zip")}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Country"
                type="text"
                fullWidth
                value={formData.country}
                onChange={handleChange("country")}
                required
              />
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            value={formData.phone}
            onChange={handleChange("phone")}
            sx={{ mb: 1, mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !formData.name ||
              !formData.line1 ||
              !formData.city ||
              !formData.state ||
              !formData.zip ||
              !formData.country ||
              !formData.phone
            }
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
