/* tslint:disable */
/* eslint-disable */

/**
 * An activity (holiday type) with its packing list
 */
export interface ActivityUiDTO {
    id?: string;
    name: string;
    packedItems: PackedItemUiDTO[];
}

/**
 * A category grouping items, e.g. Clothing or Gear
 */
export interface CategoryUiDTO {
    id: string;
    name: string;
}

/**
 * An item on the packing list of an activity
 */
export interface PackedItemUiDTO {
    id?: string;
    name: string;
    category: string;
    amount: number;
}
