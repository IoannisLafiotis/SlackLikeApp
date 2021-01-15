/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllMembershipsForUserQuery
// ====================================================

export interface AllMembershipsForUserQuery_Membership_Chanel_Memberships {
  __typename: "Membership";
  userId: string;
}

export interface AllMembershipsForUserQuery_Membership_Chanel {
  __typename: "Chanel";
  /**
   * An array relationship
   */
  Memberships: AllMembershipsForUserQuery_Membership_Chanel_Memberships[];
}

export interface AllMembershipsForUserQuery_Membership {
  __typename: "Membership";
  id: any;
  /**
   * An object relationship
   */
  Chanel: AllMembershipsForUserQuery_Membership_Chanel;
}

export interface AllMembershipsForUserQuery {
  /**
   * fetch data from the table: "Membership"
   */
  Membership: AllMembershipsForUserQuery_Membership[];
}

export interface AllMembershipsForUserQueryVariables {
  currentUserId?: string | null;
}
