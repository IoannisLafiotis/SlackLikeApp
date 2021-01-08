import * as React from "react";

// import { allUsersQuery } from 'data/queries';
import { StoreContext, Actions } from "../../../store/store";
// import { debounce} from 'lodash';
// import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Form, CloseButton, SubmitButton } from "../../../styles/ModalButtons";
import { Modal } from "../../Modal/Modal.component";
import { Query, QueryResult, withApollo } from "react-apollo";
import { allUsersQuery, checkMembership } from "../../../data/queries";
import { DataContainer, DataItem } from "../../../styles/DataModal.styles";
import { debounce, random } from "lodash";
import { SearchInput } from "../Channels/JoinChannel.component";
import { UserTag, colors, UserDeleteTag } from "./JoinDm.styles";
import { createDMChannel } from "../../../data/mutations";

interface User {
  username: string;
  id: string;
  color?: string;
}

interface Props {
  exitCallback: () => void;
  client?: any;
}

export const JoinDM = (props: Props) => {
  // console.log(props.client);
  const { user, dispatch } = React.useContext(StoreContext);
  const [selectedUsers, setSelectedUser] = React.useState<User[]>([]);

  // const [inputValue,] = React.useState<string>("");
  const fetchData = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    (refetchRef as any).current({
      currentUserId: user,
      filter: `%${e.target.value}%`,
    });
  }, 300);
  // const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) =>{
  //     e.persist();

  //     fetchData(e);

  // }
  const refetchRef = React.useRef<Function>();
  let filterUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    fetchData(e);
  };

  // useWhyDidYouUpdate("DM",props);
  //   const [selectedUsers, setSelectedUser] = React.useState<User[]>([]);
  //   const { data, loading, refetch } = useQuery(allUsersQuery, {
  //     variables: { currentUserId: user.id, filter: '%' }
  //   });
  //   const client = useApolloClient();
  //   const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     e.persist();
  //     fetchData(e);
  //   };
  //   const fetchData = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
  //     refetch({
  //       currentUserId: user.id,
  //       filter: `%${e.target.value}%`
  //     });
  //   }, 300);

  //   function setMembership(users: User[]) {
  //         props.client!.query({query: checkMembership, variables:{user1: user, user2: users[0].id}}).then((resp:any) => {
  //             if(resp.data.Membership.length){
  //             dispatch({type: Actions.SELECTED_CHANNEL, payload: resp.data.Membership[0].Chanel})} else {
  //                  console.log("rep data",resp.data.Membership);
  //                 // console.log("Resp keys",Object.keys(resp));
  //                 console.log("Resp keys",Object.keys(resp.data));
  //                 props.client!.mutate({mutation: createDMChannel, variables:{ user1: user, user2: users[0].id, title: `${user}-${users[0].id}`}}).then((resp:any) => {
  //                     // console.log("rep data",resp.data);
  //                     // console.log("Resp keys",Object.keys(resp.data));

  //                     dispatch({type: Actions.SELECTED_CHANNEL, payload: resp.data.insert_Chanel.returning[0]})
  //                 })
  //             }

  //         })}
  function setMembership(users: User[]) {
    props
      .client!.query({
        query: checkMembership([user, ...users.map((user) => user.id)]),
      })
      .then((resp: any) => {
        if (resp.data.Chanel.length) {
          dispatch({
            type: Actions.SELECTED_CHANNEL,
            payload: resp.data.Chanel[0],
          });
        } else {
          props
            .client!.mutate({
              mutation: createDMChannel([
                user,
                ...users.map((user) => user.id),
              ]),
              variables: {
                title: `${user}-${users.map((user) => user.id).join("-")}`,
              },
            })
            .then((resp: any) => {
              console.log(resp);
              dispatch({
                type: Actions.SELECTED_CHANNEL,
                payload: {
                  ...resp.data.insert_Chanel.returning[0],
                  direct: true,
                },
              });
            });
        }
      })
      .finally(() => {
        props.exitCallback();
      });
  }

  return (
    <Modal close={props.exitCallback} title="Direct Messages">
      <>
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            setMembership(selectedUsers);
            e.target.reset();
          }}
        >
          <SearchInput
            name="username"
            id="username"
            placeholder="eg leads"
            onChange={filterUsers}
          />
          <CloseButton onClick={props.exitCallback}>Cancel</CloseButton>
          <SubmitButton type="submit">Join DM</SubmitButton>
        </Form>
        <label htmlFor="username">Username</label>
        {selectedUsers.map((user) => (
          <UserTag style={{ backgroundColor: user.color }} key={user.id}>
            {user.username}
            <UserDeleteTag
              onClick={() =>
                setSelectedUser((prevState: User[]) =>
                  prevState.filter((us) => us.id !== user.id)
                )
              }
            >
              X
            </UserDeleteTag>
          </UserTag>
        ))}
        <Query
          query={allUsersQuery}
          variables={{ currentUserId: user, filter: "%" }}
        >
          {({ data, loading, refetch }: QueryResult) => {
            console.log(user);

            console.log(refetch);
            refetchRef.current = refetch;

            if (loading) {
              return <p>loading...</p>;
            }
            return (
              <DataContainer>
                {data.User.map(
                  (user: { id: string; username: string; color: string }) => (
                    <DataItem
                      key={user.id}
                      onClick={() =>
                        setSelectedUser((prevState: User[]) => {
                          if (prevState.find((us) => us.id === user.id)) {
                            return prevState;
                          }
                          return [
                            ...prevState,
                            { ...user, color: colors[random(0, 4)] },
                          ] as User[];
                        })
                      }
                    >
                      @ {user.username}
                    </DataItem>
                  )
                )}
              </DataContainer>
            );
          }}
        </Query>
      </>
    </Modal>
  );
};

export const JoinDmComponent = withApollo<
  { exitCallback: () => void; client: any },
  {}
>(JoinDM);
