import { useState, useEffect } from "react";
import {
  Box,
  Badge,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Fade,
  Avatar,
  Divider,
  Tooltip
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ClearAllIcon from "@mui/icons-material/ClearAll";

const NotificationComponent = ({
  notifications = [],
  notificationIcon,
  onMarkAllRead,
  onNotificationClick,
  onClearAll
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationState, setNotificationState] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setNotificationState(notifications);
    setUnreadCount(notifications.filter((n) => !n.isRead).length);
  }, [notifications]);

  const handleNotificationClick = (notification) => {
    onNotificationClick(notification);
    setNotificationState((prev) =>
      prev.map((n) => (n === notification ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    
    // Less than a minute
    if (diff < 60 * 1000) return 'Just now';
    // Less than an hour
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    // Less than a week
    if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
    
    // Otherwise return date
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title="Notifications">
        <IconButton 
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            position: 'relative',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: 'rgba(95, 61, 195, 0.04)'
            }
          }}
        >
          <Badge 
            badgeContent={unreadCount > 0 ? unreadCount : null} 
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.85rem',
                height: '22px',
                minWidth: '22px',
                padding: '0 6px',
                fontWeight: 'bold'
              }
            }}
          >
            <img 
              src={notificationIcon} 
              alt="Notification Icon" 
              style={{ 
                width: "2.4rem", 
                height: "2.4rem",
                filter: unreadCount > 0 ? 'brightness(1)' : 'brightness(0.85)'
              }} 
            />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleClose} 
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: '12px',
            maxHeight: '80vh',
            width: 380,
            overflow: 'hidden'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ 
          p: 2, 
          position: 'sticky', 
          top: 0, 
          bgcolor: 'background.paper', 
          zIndex: 1,
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
              Notifications
            </Typography>
            <Box>
              <Tooltip title="Mark all as read">
                <span>
                  <IconButton 
                    size="small" 
                    onClick={onMarkAllRead} 
                    disabled={unreadCount === 0}
                    sx={{ 
                      mr: 1,
                      color: unreadCount > 0 ? '#5f3dc3' : 'text.disabled' 
                    }}
                  >
                    <DoneAllIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Clear all">
                <IconButton 
                  size="small" 
                  onClick={onClearAll}
                  disabled={notificationState.length === 0}
                  sx={{ 
                    color: notificationState.length > 0 ? '#5f3dc3' : 'text.disabled' 
                  }}
                >
                  <ClearAllIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {notificationState.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <NotificationsActiveIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2, opacity: 0.5 }} />
              <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>No notifications</Typography>
            </Box>
          ) : (
            notificationState.map((notification, index) => (
              <Box key={index}>
                <MenuItem 
                  onClick={() => handleNotificationClick(notification)}
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    backgroundColor: !notification.isRead ? 'rgba(95, 61, 195, 0.04)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(95, 61, 195, 0.08)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Avatar 
                      src={notification.avatar} 
                      sx={{ 
                        width: 42, 
                        height: 42,
                        border: notification.isPinned ? '2px solid #5f3dc3' : 'none'
                      }} 
                    />
                    <Box sx={{ ml: 2, flex: 1, overflow: 'hidden' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: notification.isRead ? 400 : 600,
                            color: notification.isRead ? 'text.primary' : '#5f3dc3',
                            fontSize: '1.05rem'
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem', ml: 1, flexShrink: 0 }}
                        >
                          {formatTime(notification.timestamp)}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%',
                          mt: 0.5,
                          fontSize: '0.95rem'
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', mt: 0.5, alignItems: 'center' }}>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.2,
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            backgroundColor: getPriorityColor(notification.priority, true),
                            color: getPriorityColor(notification.priority),
                          }}
                        >
                          {notification.priority.toUpperCase()}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            ml: 1,
                            px: 1,
                            py: 0.2,
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            color: 'text.secondary',
                          }}
                        >
                          {notification.category}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </MenuItem>
                {index < notificationState.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </Box>
      </Menu>
    </Box>
  );
};

// Helper function to get color based on priority
const getPriorityColor = (priority, isBackground = false) => {
  const colors = {
    high: isBackground ? 'rgba(211, 47, 47, 0.1)' : '#d32f2f',
    medium: isBackground ? 'rgba(237, 108, 2, 0.1)' : '#ed6c02', 
    low: isBackground ? 'rgba(46, 125, 50, 0.1)' : '#2e7d32'
  };
  
  return colors[priority.toLowerCase()] || (isBackground ? 'rgba(0, 0, 0, 0.1)' : '#757575');
};

export default NotificationComponent;