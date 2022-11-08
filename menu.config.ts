import { ConfigurableMenuItem } from "./components/ConfigurableMenu/ConfigurableMenu.interface";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonIcon from "@mui/icons-material/Person";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ChairIcon from "@mui/icons-material/Chair";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import { Logout } from "@mui/icons-material";
import StraightenIcon from '@mui/icons-material/Straighten';

const MenuConfig: ConfigurableMenuItem[] = [
  {
    titleI18NKey: "menu.dashboard",
    route: "/",
    icon: DashboardIcon,
    group: "default",
    groupI18NKey: "menu.group.default"
  },
  {
    titleI18NKey: "menu.textComplexity",
    route: "/text-complexity",
    icon: StraightenIcon,
    group: "default",
    groupI18NKey: "menu.group.default"
  },
  {
    titleI18NKey: "menu.entities.articles",
    route: "/entities/articles",
    icon: NewspaperIcon,
    groupI18NKey: "menu.group.entities",
    group: "entities",
  }, {
    titleI18NKey: "menu.entities.persons",
    route: "/entities/persons",
    icon: PersonIcon,
    groupI18NKey: "menu.group.entities",
    group: "entities",
  },
  {
    titleI18NKey: "menu.settings",
    route: "/settings",
    icon: SettingsIcon,
    groupI18NKey: "menu.group.settings",
    group: "settings",
  },
  {
    titleI18NKey: "menu.logout",
    route: "/logout",
    icon: Logout,
    groupI18NKey: "menu.group.settings",
    group: "settings",
  },
];

export default MenuConfig;
