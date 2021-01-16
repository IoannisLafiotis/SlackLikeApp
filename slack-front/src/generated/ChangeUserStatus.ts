/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeUserStatus
// ====================================================

export interface ChangeUserStatus_update_User {
  __typename: "User_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface ChangeUserStatus {
  /**
   * update data of the table: "User"
   */
  update_User: ChangeUserStatus_update_User | null;
}

export interface ChangeUserStatusVariables {
  userId: string;
  status: string;
}
