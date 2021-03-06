import * as React from "react";
import styled from "styled-components";
import { Query, QueryResult } from "react-apollo";
import { MessageQuery, MessageQuery_Mesage } from "../generated/MessageQuery";
import { StoreContext } from "../store/store";
import { messageQuery } from "../data/queries";
import { messageSubscription } from "../data/subscriptions";
import { isToday, isYesterday } from "date-fns";
import { groupBy } from "lodash";
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
export const DateHeader = styled.h2`
  text-align: center;
  font-weight: bold;
  font-size: 1.3rem;
  margin: 1rem 0;
  text-transform: capitalize;
`;
export const DateSpan = styled.span`
  color: darkgrey;
`;

// interface Message {
//   id: string;
//   body: string;
//   date: string;
//   User: {
//     username: string;
//   };
// }

export function MessageBox() {
  const messageListRef = React.createRef<HTMLDivElement>();
  const [data] = React.useState<MessageQuery_Mesage[] | undefined>(undefined);
  const { selectedChannel, user } = React.useContext(StoreContext);

  React.useEffect(() => {
    if (selectedChannel && user.id) {
      messageListRef.current!.scrollTo(0, messageListRef.current!.scrollHeight);
    }
  }, [data, selectedChannel, messageListRef, user]);

  // React.useLayoutEffect(() => {
  //   if (messageListRef.current) {
  //     messageListRef.current!.scrollTo(0, messageListRef.current!.scrollHeight);
  //   }
  // }, [data, messageListRef]);

  if (!selectedChannel) {
    return <div />;
  }

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

  let df = new Intl.DateTimeFormat(
    navigator.languages ? navigator.languages[0] : "en-US",
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }
  );
  let dates: any;

  if (!selectedChannel) {
    return <div></div>;
  }
  if (!user.id) {
    return <div></div>;
  }

  return (
    <Query query={messageQuery} variables={{ channelId: selectedChannel.id }}>
      {({ loading, data, subscribeToMore }: QueryResult<MessageQuery>) => {
        if (data && data.Mesage) {
          const dtf = new Intl.DateTimeFormat(
            navigator.languages ? navigator.languages[0] : "en-US"
          );
          dates = groupBy(data.Mesage, (message: any) =>
            dtf.format(new Date(message.date))
          );
        }
        const rtf = new (Intl as any).RelativeTimeFormat(
          navigator.languages ? navigator.languages[0] : "en-US",
          { numeric: "auto" }
        );

        subscription(subscribeToMore);
        return (
          <Container ref={messageListRef}>
            <ul>
              {/* {error ? error : null} */}
              {!data || !data.Mesage ? <p>Select a channel</p> : null}
              {!loading && data && data.Mesage
                ? Object.keys(dates).map((key) => (
                    <div key={key}>
                      <DateHeader>
                        {isToday(new Date(dates[key][0].date))
                          ? rtf.format(0, "day")
                          : isYesterday(new Date(dates[key][0].date))
                          ? rtf.format(-1, "day")
                          : key}
                      </DateHeader>
                      {dates[key].map((message: any) => {
                        return (
                          <li key={message.id}>
                            <Username>{message.User.username}</Username>
                            <DateSpan>
                              {df.format(new Date(message.date))}
                            </DateSpan>
                            <p>{message.body}</p>
                          </li>
                        );
                      })}
                    </div>
                  ))
                : null}
            </ul>
          </Container>
        );
      }}
    </Query>
  );
}
