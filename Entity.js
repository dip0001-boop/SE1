let NEXT_ENTITY_ID = 1;

export function createEntityId() {
  return NEXT_ENTITY_ID++;
}

export function resetEntityIdCounter() {
  NEXT_ENTITY_ID = 1;
}

export const INVALID_ENTITY = 0;
