/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: MessageSubscription
// ====================================================

export interface MessageSubscription_Mesage_User {
  __typename: "User";
  username: string;
}

export interface MessageSubscription_Mesage {
  __typename: "Mesage";
  id: any;
  body: string;
  date: any;
  /**
   * An object relationship
   */
  User: MessageSubscription_Mesage_User;
}

export interface MessageSubscription {
  /**
   * fetch data from the table: "Mesage"
   */
  Mesage: MessageSubscription_Mesage[];
}

export interface MessageSubscriptionVariables {
  channelId?: any | null;
}
