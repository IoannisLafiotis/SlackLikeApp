import * as React from "react";
import { Modal } from "../../Modal/Modal.component";
// import { Form } from 'styles/ModalButtons';
// import { allChannelsQuery } from 'data/queries';
import styled from "styled-components";
// import { Input } from 'styles/Input.styles';
import { debounce } from 'lodash';
import { StoreContext, Actions } from '../../../store/store';
// import { SubmitButton, CloseButton, Form } from '../../../styles/ModalButtons';
// import { Input } from '../../../styles/Input.styles';
import { Query, QueryResult, Mutation, MutationFunction } from "react-apollo";
import { allChannelsQuery } from "../../../data/queries";
import { Form } from "../../../styles/ModalButtons";
import { Input } from "../../../styles/Input.styles";
import { joinChannel } from "../../../data/mutations";
// import { joinChannel } from 'data/mutations';
// import { DataContainer, DataItem } from 'styles/DataModal.styles';
// import { Channel } from 'components/Channels';
// import { useMutation, useQuery } from '@apollo/react-hooks';
console.log("removed git!")
interface Props {
  exitCallback: () => void;
}
const ChannelItem = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid ${(props) => props.theme.borderColorLight};
  box-sizing: border-box;
  cursor: pointer;
`;

const SearchInput = styled(Input)`
  width: 100%;
  box-sizing: border-box;
`;
const ChannelContainer = styled.div`
  max-height: calc(100vh - 200px);
  box-sizing: auto;
`;

export function JoinChannel(props: Props) {
    const { user, dispatch } = React.useContext(StoreContext);
    // const [createMembership] = useMutation(joinChannel);
    // const { data, loading, refetch } = useQuery(allChannelsQuery, {
    //   variables: { channelName: '%%' }
    // });
    const createMembershipRef = React.useRef<MutationFunction>();
    const refetchRef = React.useRef<Function>(); 
    const fetchData = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      (refetchRef as any).current({channelName: `%${e.target.value}%`})
    }, 300);
    let filterChannels = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      
      fetchData(e);
    };
    
    function selectChannel(channel:{id: string,name:string}, memberships: {userId: string}[]){
        console.log("fired");
        if(memberships.some(membership => 
            membership.userId === user)){
                dispatch({type: Actions.SELECTED_CHANNEL,payload:channel});

            } else {
                (createMembershipRef as any).current({variables: {channelId: channel.id,userId: user}}).then((resp:any) => {
                    const channelAffiliation = resp.data.insert_Membership.returning[0].Chanel
                    dispatch({type: Actions.SELECTED_CHANNEL,payload:channelAffiliation});
                })
            }
            props.exitCallback();

    }
  
  return (
    <Modal close={props.exitCallback} title="Join Channel">
     
            <>
              <Form>
                <SearchInput
                  name="channelName"
                  id="channelName"
                  placeholder="Search channels"
                  onChange={filterChannels}
                />
              </Form>
              <Mutation mutation={joinChannel}>
              {(createMembershipFn: MutationFunction) => {
                  createMembershipRef.current = createMembershipFn;
                  return (
              <Query query={allChannelsQuery} variables={{ channelName: '%%' }}>
        {({ data, loading,refetch }: QueryResult) => {
            refetchRef.current = refetch;
          if (loading) {
            return <p>loading...</p>;
          }
          return (
              <ChannelContainer>
                {data.Chanel.map((channel: { id: string; name: string , Memberships: any }) => (
                  <ChannelItem key={channel.id} onClick={() => selectChannel({id:channel.id, name:channel.name}, channel.Memberships)}># {channel.name}</ChannelItem>
                ))}
              </ChannelContainer>
          
           ) }}
              </Query>
             )}}
              </Mutation>
            
        </>
    </Modal>
  );
}
