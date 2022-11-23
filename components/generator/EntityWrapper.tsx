import { useQuery } from '@tanstack/react-query';
import React, { FC, ReactElement } from 'react'
import { GenericGetItem } from '../../data/ReactQueries';
import { ApiFetch } from '../../helpers/ApiFetch';
import { ApipFilterEncoder } from '../../helpers/ApiPlatform/apip-filter-encoder';
import createCacheKey from './createCacheKey'

interface EntityWrapperProps<T> {
    id: string;
    children: (item: T) => JSX.Element;
    path: string;
    properties?: string[];
}

function EntityWrapper<T>(props: EntityWrapperProps<T>) {
    const filterEncoder = new ApipFilterEncoder();
    const path = filterEncoder.addArrayFilter("properties", props.properties).encode();
    const { data, isLoading } = useQuery(
        createCacheKey({ entity: props.path, id: props.id }),
        () => GenericGetItem<T>(`/${props.path}/${props.id}?${path}`)
    )
    return (<>
        {data && props.children(data)}
    </>);
}

export default EntityWrapper