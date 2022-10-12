import { OverridableComponent } from "@mui/material/OverridableComponent";

export interface ConfigurableMenuItem {
    group?: string,
    groupI18NKey?: string,
    titleI18NKey: string,
    subtitleI18NKey?: string,
    icon?: OverridableComponent<any>,
    displayForRoles?: string[];
    route: string;
    externalLink?: boolean;
    openInNewTab?: boolean;
    children?: ConfigurableMenuItem[]
}


