/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SidebarQuery
// ====================================================

export interface SidebarQuery_Chanel_Memberships_User {
  __typename: "User";
  status: string;
  username: string;
}

export interface SidebarQuery_Chanel_Memberships {
  __typename: "Membership";
  userId: string;
  direct: boolean;
  id: any;
  /**
   * An object relationship
   */
  User: SidebarQuery_Chanel_Memberships_User;
}

export interface SidebarQuery_Chanel_Memberships_aggregate_aggregate {
  __typename: "Membership_aggregate_fields";
  count: number | null;
}

export interface SidebarQuery_Chanel_Memberships_aggregate {
  __typename: "Membership_aggregate";
  aggregate: SidebarQuery_Chanel_Memberships_aggregate_aggregate | null;
}

export interface SidebarQuery_Chanel {
  __typename: "Chanel";
  id: any;
  name: string;
  /**
   * An array relationship
   */
  Memberships: SidebarQuery_Chanel_Memberships[];
  /**
   * An aggregated array relationship
   */
  Memberships_aggregate: SidebarQuery_Chanel_Memberships_aggregate;
}

export interface SidebarQuery {
  /**
   * fetch data from the table: "Chanel"
   */
  Chanel: SidebarQuery_Chanel[];
}

export interface SidebarQueryVariables {
  user: string;
}
