import { useAuth } from '../context/authContext';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Task Management
                    </Typography>
                    <Typography sx={{ mr: 2 }}>
                        Welcome, {user.username}
                    </Typography>
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4">
                    Dashboard
                </Typography>
                {/* We'll add task management components here later */}
            </Box>
        </Box>
    );
};

export default Dashboard;