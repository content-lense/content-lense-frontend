import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { FC, useContext, useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ConfigurableMenu from "./ConfigurableMenu/ConfigurableMenu";
import MenuConfig from "../menu.config";
import { useRouter } from "next/router";
import Link from "next/link";
import { PwaContext } from "../helpers/PwaContext";
import LoadingScreen from "./LoadingScreen";
import Image from "next/image";

interface AuthenticatedLayoutProps {
  children: JSX.Element;
}

const AuthenticatedLayout: FC<AuthenticatedLayoutProps> = (props) => {
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const router = useRouter();

  const drawerWidth = 240;

  const drawer = (
    <div>
      <Toolbar sx={{ cursor: "pointer" }}>
        <Link href="/" passHref>
          <Stack flexDirection="row" gap={1} alignItems="center">
            <Image layout="fill" objectFit="contain" alt={"Content Lense"} src="/images/logo.png" />
          </Stack>
        </Link>
      </Toolbar>

      <ConfigurableMenu ignoreRoles={true} items={MenuConfig} />
    </div>
  );
  const { logoutUserAndRedirectToLogin, isLoadingUser, isAuthenticated, user } =
    useContext(PwaContext);

  useEffect(() => {
    if (isAuthenticated === false && !isLoadingUser && !user) {
      logoutUserAndRedirectToLogin();
    }
  }, [user, isAuthenticated, isLoadingUser]);

  if (isLoadingUser && !isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Content Lense
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
};

export default AuthenticatedLayout;
