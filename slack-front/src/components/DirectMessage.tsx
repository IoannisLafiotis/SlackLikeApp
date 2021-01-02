import * as React from "react";
import styled from "styled-components";
import { Channel } from "./Channels";
import { StoreContext, Actions } from "../store/store";
import { Item } from "../styles/SidebarItem.styles";
import {  JoinDmComponent } from "./Sidebar/DMs/JoinDm.component";

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

// const MembersCount = styled.span`
//   padding: 3px;
//   background-color: ${props => props.theme.backgroundColorGrey};
//   color: ${props => props.theme.textColorDark};
//   margin-right: calc(0.4rem - 1px);
//   border-radius: 80%;
// `;

interface DirectMessageProps {
  channels: Channel[];
}

export function DirectMessages({ channels }: DirectMessageProps) {
  const { dispatch } = React.useContext(StoreContext);
  // const [isCreateChannelOpen, setCreateChannelModal] = React.useState(false);
  const [isJoinChannelOpen, setJoinChannelModal] = React.useState<boolean>(false);

  const selectChannel = (channel: { id: string; name: string }) => {
    dispatch({
      type: Actions.SELECTED_CHANNEL,
      payload: channel,
    });
  };

  return (
    <>
    {isJoinChannelOpen ? <JoinDmComponent exitCallback={() => setJoinChannelModal(false)} /> :null}
      <MessagesTitles>
        <h2>Messages</h2>
        <i className="fas fa-plus" onClick={() => setJoinChannelModal(true)}/>
      </MessagesTitles>

      <ul>
        {channels.map((channel) => (
          <Item
            onClick={() =>
              selectChannel({ id: channel.id, name: channel.name })
            }
            key={channel.id}
          >
            # {channel.name}
          </Item>
        ))}
      </ul>
    </>
  );
}
