import { ConfigurableMenuItem } from "./components/ConfigurableMenu/ConfigurableMenu.interface";
import PersonIcon from "@mui/icons-material/Person";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyIcon from '@mui/icons-material/Key';
import { Logout, TopicOutlined } from "@mui/icons-material";
import StraightenIcon from '@mui/icons-material/Straighten';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import PeopleIcon from '@mui/icons-material/People';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import WebhookIcon from '@mui/icons-material/Webhook';
import LinkIcon from '@mui/icons-material/Link';
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
    titleI18NKey: "menu.topics",
    route: "/topics",
    icon: BubbleChartIcon,
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
    titleI18NKey: "menu.entities.authors",
    route: "/entities/authors",
    icon: PersonIcon,
    groupI18NKey: "menu.group.entities",
    group: "entities",
  },
  {
    titleI18NKey: "menu.entities.topics",
    route: "/entities/topics",
    icon: BubbleChartIcon,
    groupI18NKey: "menu.group.entities",
    group: "entities",
  },
  {
    titleI18NKey: "menu.api-key",
    route: "/settings/api-key",
    icon: KeyIcon,
    groupI18NKey: "menu.group.settings",
    group: "settings",
  },
  {
    titleI18NKey: "menu.users",
    route: "/settings/users",
    icon: PeopleIcon,
    groupI18NKey: "menu.group.settings",
    group: "settings",
  },
  {
    titleI18NKey: "menu.analysis-microservices",
    route: "/settings/analysis-microservices",
    icon: TroubleshootIcon,
    groupI18NKey: "menu.group.settings",
    group: "settings",
  },
  {
    titleI18NKey: "menu.webhooks",
    route: "/settings/webhooks",
    icon: WebhookIcon,
    groupI18NKey: "menu.group.settings",
    group: "settings",
  },
  {
    titleI18NKey: "menu.article-sources",
    route: "/settings/article-sources",
    icon: LinkIcon,
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
