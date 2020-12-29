/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MembershipQuery
// ====================================================

export interface MembershipQuery_Membership_Chanel {
  __typename: "Chanel";
  id: any;
  name: string;
}

export interface MembershipQuery_Membership {
  __typename: "Membership";
  id: any;
  direct: boolean;
  /**
   * An object relationship
   */
  Chanel: MembershipQuery_Membership_Chanel;
}

export interface MembershipQuery {
  /**
   * fetch data from the table: "Membership"
   */
  Membership: MembershipQuery_Membership[];
}
