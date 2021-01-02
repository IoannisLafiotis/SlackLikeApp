import * as React from "react";
import styled from "styled-components";
import { Channels, Channel } from "./Channels";
import { DirectMessages } from "./DirectMessage";
import { Query, QueryResult } from "react-apollo";
import { membershipQuery } from "../data/queries";
import { membershipSubscription } from "../data/subscriptions";
import { SidebarQuery } from "../generated/SidebarQuery";
// import { MessageQuery_Mesage } from "../generated/MessageQuery";

const SidebarContainer = styled.div`
  height: 100%;
  background: rebeccapurple;
  padding: 1rem;
  color: white;
  box-sizing: border-box;
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr 25px;
  font-size: 1.2rem;
`;
const Status = styled.span`
  height: 1.2rem;
  width: 1.2rem;
  border-radius: 100%;
  background-color: green;
`;

const H1 = styled.h1`
  font-weight: 900;
  font-size: 1.3rem;
`;
const UsernameContainer = styled.div`
  font-size: 1rem;
  grid-column-start: 1;
  grid-column-end: 3;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
`;

interface Membership {
  direct: boolean;
  id: string;
  Chanel: Channel;
}

export function Sidebar() {
  const subscription = (subscribeToMore: any) => {
    subscribeToMore({
      // variables: { channelId: selectedChannel.id },
      document: membershipSubscription,
      updateQuery: (prev: SidebarQuery[], { subscriptionData }: any) => {
        // console.log(prev);
        if (!subscriptionData.data) return prev;

        return Object.assign({}, prev, subscriptionData.data);
      },
    });
  };
  return (
    <Query query={membershipQuery}>
      {({ loading, data, subscribeToMore }: QueryResult<SidebarQuery>) => {
        subscription(subscribeToMore);
        return (
          <SidebarContainer>
            <Header>
              <H1>Slack clone</H1>

              <div>
                <i className="far fa-bell"></i>
              </div>
              <UsernameContainer>
                <Status></Status>
                <button>Log out</button>
              </UsernameContainer>
            </Header>
            {!loading && data && data.Membership ? (
              <>
                <Channels
                  channels={(data.Membership as Membership[])
                    .filter((membership) => !membership.direct)
                    .map((membership) => membership.Chanel)}
                />
                <DirectMessages
                  channels={(data.Membership as Membership[]).reduce(
                    (acc, value) => {
                      if (value.direct) {
                        return [...acc, value.Chanel];
                      }
                      return acc;
                    },
                    [] as Channel[]
                  )}
                />
              </>
            ) : null}
          </SidebarContainer>
        );
      }}
    </Query>
  );
}
