import * as React from "react";
import styled from "styled-components";
import { Channel } from "./Channels";
import { StoreContext, Actions } from "../store/store";
import { Item } from "../styles/SidebarItem.styles";
import { JoinDmComponent } from "./Sidebar/DMs/JoinDm.component";
import { Status } from "./Sidebar";

const MessagesTitles = styled.div`
  margin: 2rem 0 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  h2 {
    font-size: 1rem;
  }
`;

const MembersCount = styled.span`
  padding: 3px;
  background-color: ${(props) => props.theme.backgroundColorGrey};
  color: ${(props) => props.theme.textColorDark};
  margin-right: calc(0.4rem - 1px);
  border-radius: 80%;
`;

interface DirectMessageProps {
  channels: Channel[];
}

export function DirectMessages({ channels }: DirectMessageProps) {
  const { dispatch, user } = React.useContext(StoreContext);
  // const [isCreateChannelOpen, setCreateChannelModal] = React.useState(false);
  const [isJoinChannelOpen, setJoinChannelModal] = React.useState<boolean>(
    false
  );

  const selectChannel = (channel: {
    id: string;
    name: string;
    members: number;
  }) => {
    dispatch({
      type: Actions.SELECTED_CHANNEL,
      payload: channel,
    });
  };

  function DMTitles(channel: Channel) {
    return channel.Memberships.reduce((acc, value: any) => {
      if (value.userId !== user.id) {
        return [...acc, value.User.username];
      }
      return acc;
    }, [] as string[]).join(" - ");
  }

  return (
    <>
      {isJoinChannelOpen ? (
        <JoinDmComponent exitCallback={() => setJoinChannelModal(false)} />
      ) : null}
      <MessagesTitles>
        <h2>Messages</h2>
        <i className="fas fa-plus" onClick={() => setJoinChannelModal(true)} />
      </MessagesTitles>

      <ul>
        {channels.map((channel) => (
          <Item
            onClick={() =>
              selectChannel({
                id: channel.id,
                name: channel.name,
                members: channel.Memberships_aggregate.aggregate.count,
              })
            }
            key={channel.id}
          >
            {channel.Memberships.length === 2 ? (
              <Status />
            ) : (
              <MembersCount>{channel.Memberships.length - 1}</MembersCount>
            )}{" "}
            {DMTitles(channel)}
          </Item>
        ))}
      </ul>
    </>
  );
}
