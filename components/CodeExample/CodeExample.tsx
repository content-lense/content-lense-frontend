import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Tab, Tabs } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Highlight from 'react-highlight'
import {
    Api,
    ExpandMore,
    Input,
    Javascript,
    JavascriptOutlined,
    PhpOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import { useTranslation } from 'next-i18next';
import { useUser } from '../../helpers/useUser';
import createCacheKey from '../generator/createCacheKey';
import { useQuery } from '@tanstack/react-query';
import { OrganisationTeamMemberInterface } from '../../interfaces/UserInterface';
import { GenericGetItem } from '../../data/ReactQueries';
import getConfig from 'next/config';
import ReactMarkdown from 'react-markdown'
import prettier from "prettier/standalone";
import typescriptParser from "prettier/parser-typescript";
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

const { publicRuntimeConfig } = getConfig();

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box
                    sx={{
                        p: 0,
                    }}
                >
                    {children}
                </Box>
            )}
        </div>
    );
}

type Request<POST, PUT> = {
    post?: POST;
    put?: PUT;
    get?: boolean;
    delete?: boolean;
}

type Iri = {
    /**
     * articles
     */
    entity: string;
    /**
     * For put and delete request an id is required.
     */
    id?: string;
}

interface CodeExampleProps<POST, PUT, GET> {
    markdown?: string;
    /**
     * The iri without a / in the beginning nor in the end.
     * For example: articles or users/organisations
     */
    iri: Iri;
    /**
     * The values which should be send in the request.
     */
    properties?: Request<POST, PUT>;
}

type CodeExampleInterface = {
    [RequestMethod.POST]?: string;
    [RequestMethod.PUT]?: string;
    [RequestMethod.GET]?: string;
    [RequestMethod.DELETE]?: string
}

enum RequestMethod {
    POST = "post",
    PUT = "put",
    DELETE = "delete",
    GET = "get",
}

function CodeExample<POST, PUT, GET>(props: CodeExampleProps<POST, PUT, GET>) {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [codeExampleTS, setCodeExampleTS] = useState<CodeExampleInterface>({});
    const [apiToken, setApiToken] = useState("");
    const [currentRequestMethod, setCurrentRequestMethod] = useState(RequestMethod.POST);
    const [codeExamplePy, setCodeExamplePy] = useState<CodeExampleInterface>({});

    const { user } = useUser();

    const { data: organisation } = useQuery(createCacheKey({ entity: "organisation", id: user?.ownedOrganisations[0] }),
        () => GenericGetItem<OrganisationTeamMemberInterface>(user?.ownedOrganisations[0] ?? ""),
        {
            enabled: !!user?.id,
            onSuccess(orga) {
                setApiToken(orga.apiToken)
            },
        }
    )

    function generateCodeExampleTS(method: RequestMethod) {
        let jsCodeExample;
        let requestString: string = "";
        let formatted;
        switch (method) {
            case RequestMethod.POST:
                if (props.properties?.post) {
                    jsCodeExample = `{
                    method: "POST",
                    body: JSON.stringify(${JSON.stringify(props.properties?.post)}),
                    headers: {
                        "Content-Type": "application/json",
                        "X-AUTH-TOKEN": "${apiToken}"
                    },
                }`;
                    requestString = `fetch("${publicRuntimeConfig.API_ENDPOINT}/${props.iri.entity}", ${jsCodeExample}).then((response) => {
                        // Put suceeding code here
                    })`
                    formatted = prettier.format(requestString, {
                        parser: "typescript",
                        plugins: [typescriptParser],
                        tabWidth: 4,
                    });
                }
                break;
            case RequestMethod.PUT:
                if (props.properties?.put) {
                    jsCodeExample = `{
                        method: "PUT",
                        body: JSON.stringify(${JSON.stringify(props.properties?.put)}),
                        headers: {
                            "Content-Type": "application/json",
                            "X-AUTH-TOKEN": "${apiToken}"
                        },
                    }`;
                    requestString = `fetch("${publicRuntimeConfig.API_ENDPOINT}/${props.iri.entity}/${props.iri.id}", ${jsCodeExample}).then((response) => {
                            // Put suceeding code here
                        })`
                    formatted = prettier.format(requestString, {
                        parser: "typescript",
                        plugins: [typescriptParser],
                        tabWidth: 4,
                    });
                }
                break;
            case RequestMethod.GET:
                jsCodeExample = `{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-AUTH-TOKEN": "${apiToken}"
                    },
                }`;
                requestString = `fetch("${publicRuntimeConfig.API_ENDPOINT}/${props.iri.entity}", ${jsCodeExample}).then((response) => {
                        // Put suceeding code here
                    })`
                formatted = prettier.format(requestString, {
                    parser: "typescript",
                    plugins: [typescriptParser],
                    tabWidth: 4,
                });
                break;
            case RequestMethod.DELETE:
                jsCodeExample = `{
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-AUTH-TOKEN": "${apiToken}"
                    },
                }`;
                requestString = `fetch("${publicRuntimeConfig.API_ENDPOINT}/${props.iri.entity}/${props.iri.id}", ${jsCodeExample}).then((response) => {
                        // Put suceeding code here
                    })`
                formatted = prettier.format(requestString, {
                    parser: "typescript",
                    plugins: [typescriptParser],
                    tabWidth: 4,
                });
                break;

            default:
                break;
        }
        setCodeExampleTS({ ...codeExampleTS, [method]: formatted })
    }

    function generateCodeExamplePy(method: RequestMethod) {
        let jsCodeExample;
        let requestString: string = "";
        let formatted;
        switch (method) {
            case RequestMethod.POST:
                if (props.properties?.post) {
                    formatted = `import requests
req = requests.post("${publicRuntimeConfig.API_ENDPOINT}/${props.iri.entity}", verify=False, json=${JSON.stringify(props.properties?.post, null, 4)}, headers=${JSON.stringify({
                        "Content-Type": "application/json",
                        "X-AUTH-TOKEN": apiToken
                    }, null, 4)})
print(req.text)`;
                }
                break;
            case RequestMethod.PUT:
                if (props.properties?.put) {
                    formatted = `import requests
req = requests.put("${publicRuntimeConfig.API_ENDPOINT}/${props.iri.entity}/${props.iri.id}", verify=False, json={${JSON.stringify(props.properties?.put, null, 4)}}, headers=${JSON.stringify({
                        "Content-Type": "application/json",
                        "X-AUTH-TOKEN": apiToken
                    }, null, 4)})
print(req.text)`;
                }
                break;
            case RequestMethod.GET:
                if (props.properties?.get) {
                    formatted = `import requests
req = requests.get("${publicRuntimeConfig.API_ENDPOINT}/${props.iri.entity}", verify=False, headers=${JSON.stringify({
                        "Content-Type": "application/json",
                        "X-AUTH-TOKEN": apiToken
                    }, null, 4)})
print(req.text)`;
                }
                break;
            case RequestMethod.DELETE:
                if (props.properties?.get) {
                    formatted = `import requests
req = requests.delete("${publicRuntimeConfig.API_ENDPOINT}/${props.iri.entity}/${props.iri.id}", verify=False, headers=${JSON.stringify({
                        "Content-Type": "application/json",
                        "X-AUTH-TOKEN": apiToken
                    }, null, 4)})
print(req.text)`;
                }
                break;

            default:
                break;
        }
        setCodeExamplePy({ ...codeExamplePy, [method]: formatted })
    }

    useEffect(() => {
        generateCodeExampleTS(currentRequestMethod);
        generateCodeExamplePy(currentRequestMethod);
    }, [])

    return (
        <>
            <Stack>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Stack direction={"row"} alignItems="center" justifyContent={"space-between"} >
                        <Tabs value={selectedTab} onChange={(e, value) => setSelectedTab(value)}>
                            <Tab icon={<Image width={32} height={32} src="/icons/js.png" />} />
                            <Tab icon={<Image width={32} height={32} src="/icons/python.png" />} />
                            <Tab icon={<Image width={32} height={32} src="/icons/php.png" />} />
                        </Tabs>

                        <Stack direction={"row"} alignItems="center" spacing={1}>
                            <IconButton onClick={() => {
                                switch (selectedTab) {
                                    case 0:
                                        if (codeExampleTS[currentRequestMethod])
                                            navigator.clipboard.writeText(codeExampleTS[currentRequestMethod] ?? "")
                                        break;
                                    case 1:
                                        if (codeExamplePy[currentRequestMethod])
                                            navigator.clipboard.writeText(codeExamplePy[currentRequestMethod] ?? "")
                                        break;
                                    // case 2:
                                    //     if (codeExampleTS[currentRequestMethod])
                                    //         navigator.clipboard.writeText(codeExampleP[currentRequestMethod] ?? "")
                                    //     break;
                                    default:
                                        break;
                                }
                            }}>
                                <ContentCopyRoundedIcon />
                            </IconButton>
                            <FormControl>
                                <Select
                                    id="demo-simple-select"
                                    value={currentRequestMethod}
                                    onChange={(e) => {
                                        setCurrentRequestMethod(e.target.value as RequestMethod);
                                        generateCodeExampleTS(e.target.value as RequestMethod);
                                        generateCodeExamplePy(e.target.value as RequestMethod);
                                    }}
                                >
                                    {props.properties?.post &&
                                        <MenuItem value={RequestMethod.POST}>{RequestMethod.POST}</MenuItem>
                                    }
                                    {props.properties?.put &&
                                        <MenuItem value={RequestMethod.PUT}>{RequestMethod.PUT}</MenuItem>
                                    }
                                    {props.properties?.get &&
                                        <MenuItem value={RequestMethod.GET}>{RequestMethod.GET}</MenuItem>
                                    }
                                    {props.properties?.delete &&
                                        <MenuItem value={RequestMethod.DELETE}>{RequestMethod.DELETE}</MenuItem>
                                    }
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
                </Box>
                <TabPanel value={selectedTab} index={0}>
                    {props.markdown &&
                        <ReactMarkdown>
                            {props.markdown}
                        </ReactMarkdown>
                    }
                    <Highlight className="ts">
                        {codeExampleTS[currentRequestMethod]}
                    </Highlight>
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                    {props.markdown &&
                        <ReactMarkdown>
                            {props.markdown}
                        </ReactMarkdown>
                    }
                    <Highlight className="python">
                        {codeExamplePy[currentRequestMethod]}
                    </Highlight>
                </TabPanel>
                <TabPanel value={selectedTab} index={2}>
                    {props.markdown &&
                        <ReactMarkdown>
                            {props.markdown}
                        </ReactMarkdown>
                    }
                    {/* <Highlight className="sh">
                        {codeExamplePy[currentRequestMethod]}
                    </Highlight> */}
                </TabPanel>
            </Stack>
        </>
    )
}

export default CodeExample