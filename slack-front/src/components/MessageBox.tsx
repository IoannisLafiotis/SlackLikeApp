import * as React from "react";
import styled from "styled-components";
import { Query, QueryResult } from "react-apollo";
import { MessageQuery, MessageQuery_Mesage } from "../generated/MessageQuery";
import { StoreContext } from "../store/store";
import { messageQuery } from "../data/queries";
import { messageSubscription } from "../data/subscriptions";

const Container = styled.div`
  margin-top: 85px;
  overflow-y: auto;
  height: calc(100vh - 185px);
  li {
    margin: 0.5rem 0;
  }
  p {
    margin-top: 0.25rem;
  }
`;
const Username = styled.span`
  font-weight: 800;
  margin-right: 5px;
  font-size: 1.2rem;
`;
const DataSpan = styled.span`
  color: darkgrey;
`;

interface Message {
  id: string;
  body: string;
  date: string;
  User: {
    username: string;
  };
}

export function MessageBox() {
  const messageListRef = React.createRef<HTMLDivElement>();
  const { selectedChannel } = React.useContext(StoreContext);
  React.useEffect(() => {
    messageListRef.current!.scrollTo(
      messageListRef.current!.scrollTop,
      messageListRef.current!.scrollHeight
    );
  }, [messageListRef]);

  const subscription = (subscribeToMore: any) => {
    subscribeToMore({
      variables: { channelId: selectedChannel!.id },
      document: messageSubscription,
      updateQuery: (prev: MessageQuery_Mesage[], { subscriptionData }: any) => {
        if (!subscriptionData.data) return prev;
        return Object.assign({}, prev, subscriptionData.data);
      },
    });
  };

  return (
    <Query query={messageQuery} variables={{ channelId: selectedChannel.id }}>
      {({ loading, data, subscribeToMore }: QueryResult<MessageQuery>) => {
        subscription(subscribeToMore);
        return (
          <Container ref={messageListRef}>
            <ul>
              {!loading && data!.Mesage
                ? (data!.Mesage as Message[]).map((message) => (
                    <li key={message.id}>
                      <Username>{message.User.username} </Username>
                      <DataSpan>{message.date}</DataSpan>
                      <p>{message.body}</p>
                    </li>
                  ))
                : null}
            </ul>
          </Container>
        );
      }}
    </Query>
  );
}
