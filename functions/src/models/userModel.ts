
// When writing to the DB we define an Insert Model (IM) to ensure that the correct data is written to the DB
export interface UserIM {
    /*
    Insert model for creating new users in the DB
     */
    id: string,
    name: string,
    surname: string
}