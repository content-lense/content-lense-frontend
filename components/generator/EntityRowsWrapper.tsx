import { useQuery } from '@tanstack/react-query';
import React, { FC, ReactElement } from 'react'
import { GenericGetItem, GenericGetItems, GenericGetItemsAsHydra } from '../../data/ReactQueries';
import { ApiFetch } from '../../helpers/ApiFetch';
import { ApipFilterEncoder } from '../../helpers/ApiPlatform/apip-filter-encoder';
import { ApiPlatformResponse } from '../../interfaces/ApiPlatformResponseInterface';
import createCacheKey from './createCacheKey'

interface EntityRowsWrapperProps<T> {
    children: (item: T[]) => JSX.Element;
    path: string;
    properties?: string[];
    filters?: ApipFilterEncoder;
    additionalCacheProperties?: string;
    onSuccess?: (totalLength: number) => void;
}

function EntityRowsWrapper<T>(props: EntityRowsWrapperProps<T>) {
    const filterEncoder = props.filters ?? new ApipFilterEncoder();
    filterEncoder.addArrayFilter("properties", props.properties);
    const q = filterEncoder.encode()
    const { data, isLoading } = useQuery(
        createCacheKey({ entity: props.path, q: q, additionalCacheProps: props.additionalCacheProperties }),
        () => GenericGetItemsAsHydra<T>(`/${props.path}`, (props.properties || props.filters) ? filterEncoder : undefined),
        {
            onSuccess(data) {
                props.onSuccess && props.onSuccess(data["hydra:totalItems"] ?? 0);
            }
        }
    )
    return (<>
        {data && props.children(data['hydra:member'])}
    </>);
}

export default EntityRowsWrapper
