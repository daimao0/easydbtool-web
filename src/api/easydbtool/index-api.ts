//  the request index param
export type IndexRequest = {
    // Index name
    name: string
    // Columns that the index is applied to
    columnName: string[]
    // Whether the index is unique
    unique: boolean
    // Comment for the index
    comment: string
}