// ColumnCreateRequest is the column for create a table
export type ColumnCreateRequest = {
    // Column name
    name: string
    // Column type
    type: string
    // Size column size
    size: number
    // Points column points for decimal type
    points:string
    // Default column default value
    default: string
    // NotNull column not null
    notNull: boolean
    // Comment column comment
    comment: string
    // Pk column pk
    pk: boolean
}