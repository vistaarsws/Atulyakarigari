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
  ListItemSecondaryAction,
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
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import {
  fetchProfile,
  fetchAllProfiles,
} from "../../../Redux/features/ProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../../user/profile/profile/Profile";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";
import {
  Change_Address,
  getWalletData,
  get_Address,
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

  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@shiprocket.com",
      role: "admin",
      status: "active",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.c@shiprocket.com",
      role: "admin",
      status: "active",
    },
    {
      id: 3,
      name: "Priya Patel",
      email: "priya.p@shiprocket.com",
      role: "admin",
      status: "inactive",
    },
  ]);

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");


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
    const getData = async (authToken) => {
      try {
        const data = await getWalletData(authToken);
        setBalance(data.data);
        console.log(balance.message.data.balance_amount, "data");
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    getAdminAddress();
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

  const handleDeleteAdmin = () => {
    if (selectedAdmin) {
      setAdmins(admins.filter((admin) => admin.id !== selectedAdmin.id));
      setDeleteDialogOpen(false);
      setSelectedAdmin(null);
    }
  };

  const handleSaveAdmin = () => {
    setAdminDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAddAdmin = () => {
    // Create a new admin with the email
    const newAdmin = {
      id: admins.length + 1,
      name: newAdminEmail.split("@")[0], // Simple name generation from email
      email: newAdminEmail,
      role: "admin",
      status: "active",
    };

    setAdmins([...admins, newAdmin]);
    setConfirmDialogOpen(false);
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
          {adminAddress?.message?.map((item, index) => (
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
                  <Grid item xs={12} sm={2} textAlign="right">
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleAddressDialog(item)}
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
          ))}
        </TabPanel>

        {/* ShipRocket Wallet Tab */}
        <TabPanel value={tabValue} index={2}>
          {/* Wallet Balance Section */}
          <Card
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              boxShadow: 4,
              transition: "all 0.3s",
              "&:hover": { boxShadow: 6 },
              bgcolor: "background.paper",
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
                    ₹{balance?.message?.data?.balance_amount}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Last updated: Today at 10:45 AM
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Recent Transactions
          </Typography>

          <List
            sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 2 }}
          >
            <ListItem divider sx={{ py: 2, px: 3 }}>
              <ListItemAvatar>
                <IconButton sx={{ color: "success.main" }}>
                  <TrendingUp fontSize="medium" />
                </IconButton>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography fontWeight="medium">Wallet Recharge</Typography>
                }
                secondary="Feb 15, 2025 • Transaction ID: SR2502151134"
              />
              <ListItemSecondaryAction>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", color: "success.main" }}
                >
                  +₹2,000.00
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem divider sx={{ py: 2, px: 3 }}>
              <ListItemAvatar>
                <IconButton sx={{ color: "error.main" }}>
                  <TrendingDown fontSize="medium" />
                </IconButton>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography fontWeight="medium">
                    Shipping Charge (Order #SR3421)
                  </Typography>
                }
                secondary="Feb 10, 2025 • Transaction ID: SR2502101421"
              />
              <ListItemSecondaryAction>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", color: "error.main" }}
                >
                  -₹145.50
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemAvatar>
                <IconButton sx={{ color: "error.main" }}>
                  <TrendingDown fontSize="medium" />
                </IconButton>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography fontWeight="medium">
                    Shipping Charge (Order #SR3409)
                  </Typography>
                }
                secondary="Feb 05, 2025 • Transaction ID: SR2502051056"
              />
              <ListItemSecondaryAction>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", color: "error.main" }}
                >
                  -₹210.25
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          </List>

          {/* Action Buttons */}
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                px: 3,
                py: 1.2,
                fontSize: "1rem",
                borderRadius: 2,
                transition: "all 0.3s",
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "scale(1.05)",
                },
                "&:active": { transform: "scale(0.95)" },
              }}
            >
              Add Funds
            </Button>
            <Button
              variant="outlined"
              sx={{
                px: 3,
                py: 1.2,
                fontSize: "1rem",
                borderRadius: 2,
                borderColor: "grey.400",
                transition: "all 0.3s",
                "&:hover": { bgcolor: "grey.100", borderColor: "grey.600" },
                "&:active": { transform: "scale(0.95)" },
              }}
            >
              View All Transactions
            </Button>
          </Box>
        </TabPanel>

        {/* Admin Management Tab - Only visible to Super Admin */}
        {user.role === "super-admin" && (
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                Admin Management
              </Typography>
              <Typography variant="h5" color="text.secondary">
                Create and manage admin accounts. Only super admins have access
                to this section.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <TextField
                placeholder="Search admins..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: "60%" }}
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
              >
                Add New Admin
              </Button>
            </Box>

            {filteredAdmins.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No admin accounts found matching your search.
              </Alert>
            ) : (
              <List sx={{ bgcolor: "background.paper" }}>
                {filteredAdmins.map((admin) => (
                  <ListItem
                    key={admin.id}
                    divider
                    secondaryAction={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleOpenDeleteDialog(admin)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={admin.profilePicture || "/default-avatar.png"}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={admin.name}
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
              enqueueSnackbar("Admin successfully confirmed!", {
                variant: "success",
              });
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
            Are you sure you want to delete {selectedAdmin?.name}'s admin
            account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              enqueueSnackbar("Admin account deleted successfully!", {
                variant: "success",
              });
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
      {value === index && <Box sx={{ p: 5 }}>{children}</Box>}
    </div>
  );
}
