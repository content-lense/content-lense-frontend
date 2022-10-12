import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC } from "react";
import { ConfigurableMenuItem as ConfigurableMenuItemInterface } from "./ConfigurableMenu.interface";
import ConfigurableMenuItem from "./ConfigurableMenuItem";

interface ConfigurableMenuProps {
  items: ConfigurableMenuItemInterface[];
  roles?: string[];
  ignoreRoles?: boolean;
}

const ConfigurableMenu: FC<ConfigurableMenuProps> = (props) => {
  const roles = props.roles ?? [];

  const itemsByGroups = props.items
    .map((item) => ({ ...item, group: item.group ?? "no-group" }))
    .reduce(
      (prev, curr) => ({
        ...prev,
        [curr.group]: prev?.[curr.group] ? [...prev[curr.group], curr] : [curr],
      }),
      {} as { [key: string]: ConfigurableMenuItemInterface[] }
    );

  const router = useRouter();
  const selectedItem = props.items.reduce(
    (prev, curr) => {
      const currentPath = (router.pathname ?? "").replace("/", "");
      const itemPath = curr.route.replace("/", "");
      const isSelected = currentPath.startsWith(itemPath);

      const matchingLength = Math.abs(
        currentPath.replace(itemPath, "").length - currentPath.length
      );

      return {
        longestMatch: isSelected ? matchingLength : prev.longestMatch,
        matchItem: isSelected ? curr : prev.matchItem,
      };
    },
    { longestMatch: 0, matchItem: null } as {
      longestMatch: number;
      matchItem: null | ConfigurableMenuItemInterface;
    }
  );

  const { t } = useTranslation();

  return (
    <List>
      {Object.keys(itemsByGroups).map((key, idx, source) => {
        return (
          <>
            {itemsByGroups[key][0].groupI18NKey && (
              <Typography variant="caption" sx={{ p: 1, mb: 1 }}>
                {t(itemsByGroups[key][0].groupI18NKey ?? "")}
              </Typography>
            )}

            {itemsByGroups[key]
              .filter(
                (item) =>
                  roles.some((role) => item.displayForRoles?.includes(role)) ||
                  props.ignoreRoles
              )
              .map((props) => (
                <ConfigurableMenuItem
                  isSelected={selectedItem.matchItem?.route === props.route}
                  key={props.route}
                  {...props}
                />
              ))}

            {idx !== source.length - 1 && <Divider />}
          </>
        );
      })}
    </List>
  );
};

export default ConfigurableMenu;
