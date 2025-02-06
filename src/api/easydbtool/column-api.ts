// ColumnCreateRequest is the column for create a table
export type ColumnCreateRequest = {
    // Column name
    name: string
    // Column type
    type: string
    // Size column size
    Size: number
    // Points column points for decimal type
    Points:string
    // Default column default value
    Default: string
    // NotNull column not null
    NotNull: boolean
    // Comment column comment
    Comment: string
    // Pk column pk
    Pk: boolean
}