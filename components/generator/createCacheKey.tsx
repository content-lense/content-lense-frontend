import inflection from "inflection";

type Relation = {
  entity: string;
  id: string;
};

type QueryParameter = {
  [key: string]: string | number;
};

type CCBaseQueryProps = {
  /**
   * The entitiy which is fetched
   */
  entity: string;
  /**
   * Specify query parameter like filter
   */
  q?: QueryParameter | string;
  /**
   * 
   */
  additionalCacheProps?: string;
};

type QueryPropsWithId = CCBaseQueryProps & {
  /**
   * The id of the fetched entity if item operation
   */
  id: string | number;
};

type QueryPropsWithRelation = CCBaseQueryProps & {
  /**
   * If collection operation the relation from where the entitis are fetched
   */
  relation: Relation;
};

interface CollectionUseQueryHookProps {
  itemsPerPage?: number;
}

interface ItemUseQueryHookProps<T extends string | number> {
  id: T;
}

export type CCUseQueryProps = QueryPropsWithRelation | QueryPropsWithId | CCBaseQueryProps;

function instanceOfPropsWithRelation(object: any): object is QueryPropsWithRelation {
  return "relation" in object;
}

function instanceOfPropsWithId(object: any): object is QueryPropsWithId {
  return "id" in object;
}

export default function createCacheKey(props: CCUseQueryProps) {
  const customCacheKey = [];
  if (instanceOfPropsWithRelation(props)) {
    customCacheKey.push(props.relation.entity, props.relation.id, inflection.pluralize(props.entity));
  } else if (instanceOfPropsWithId(props)) {
    customCacheKey.push(props.entity, props.id);
  } else {
    customCacheKey.push(props.entity);
  }

  if (props.q && typeof props.q !== "string") {
    Object.entries(props.q).map(([key, value], index) => {
      customCacheKey.push(key + "=" + value);
    });
  }
  if (props.q && typeof props.q === "string") {
    customCacheKey.push(props.q);
  }
  if (props.additionalCacheProps) {
    customCacheKey.push(props.additionalCacheProps);
  }
  return customCacheKey;
}
