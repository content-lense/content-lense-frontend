import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { ConfigurableMenuItem as ConfigurableMenuItemInterface } from "./ConfigurableMenu.interface";

interface ConfigurableMenuItemProps extends ConfigurableMenuItemInterface {
  isSelected?: boolean;
}

const ConfigurableMenuItem: FC<ConfigurableMenuItemProps> = (props) => {
  const Icon = props.icon;

  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Link key={props.route} href={props.route} passHref>
      <ListItem
        disablePadding
        sx={{
          borderLeft: props.isSelected ? "10px solid " + theme.palette.secondary.main : undefined,
          transition: "border 600ms",
        }}
      >
        <ListItemButton
          selected={props.isSelected}
          // onClick={() => router.push(props.route)}
        >
          <>
            {Icon && (
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
            )}
            <ListItemText
              primary={t(props.titleI18NKey)}
              secondary={t(props.subtitleI18NKey ?? "")}
            />
          </>
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default ConfigurableMenuItem;
