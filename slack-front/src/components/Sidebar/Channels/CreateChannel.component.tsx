import * as React from "react";
// import { StoreContext } from '../store/store';
// import {
//   CreateChannelMutation,
//   CreateMembership
// } from '../../../data/mutations';
// import { CreateChannel } from '../../../generated/CreateChannel';
// import { Container } from 'components/MessageLayout/MessageBox.style';
// import { ExitButtonContainer, ButtonClose, Form } from './Finder.styles';
// import { useMutation } from '@apollo/react-hooks';
import { Mutation } from "react-apollo";
// import { CreateChannel, CreateChannel_insert_Chanel } from '../generated/CreateChannel';
import { StoreContext } from "../../../store/store";
import {
  CreateMembership,
  CreateChannelMutation,
} from "../../../data/mutations";
import { Modal } from "../../Modal/Modal.component";
import { Input } from "../../../styles/Input.styles";
import { CloseButton, SubmitButton, Form } from "../../../styles/ModalButtons";

// const ExitButtonContainer = styled.div`
//   display: flex;
//   justify-content: flex-end;
// `;

interface Props {
  exitCallback: () => void;
}

export function Finder(props: Props) {
  const { user } = React.useContext(StoreContext);
  const [inputValue, setInputValue] = React.useState<string>("");
  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);
  //   const [createMembership] = useMutation(CreateMembership, {
  //     update: props.exitCallback
  //   });
  //   const [createChannel] = useMutation(CreateChannelMutation, {
  //     onCompleted: (data: CreateChannel) => {
  //       createMembership({
  //         variables: {
  //           channelId: data.insert_Chanel!.returning[0].id,
  //           userId: user.id
  //         }
  //       });
  //     }
  //   });
  return (
    <Modal close={props.exitCallback} title="Create Channel">
      <Mutation mutation={CreateMembership} update={() => props.exitCallback()}>
        {(createMembership: any) => (
          <Mutation
            mutation={CreateChannelMutation}
            onCompleted={(data: any) => {
              // console.log(data.data.data.insert_Chanel.returning[0].id)
              // console.log(Object.keys(data.insert_Chanel!.returning));
              // console.log(data.insert_Chanel.returning[0].id);
              // console.log(user);

              createMembership({
                variables: {
                  userId: user,
                  channelId: data.insert_Chanel!.returning[0].id,
                },
              });
            }}
          >
            {(createChannel: any) => (
              <>
                <Form
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    createChannel({
                      variables: { name: e.target.channelName.value },
                    });
                    e.target.reset();
                  }}
                >
                  <label htmlFor="channelName">Name</label>
                  <Input
                    name="channelName"
                    id="channelName"
                    placeholder="eg leads"
                    onChange={onChangeInputValue}
                  />
                  <CloseButton onClick={props.exitCallback}>Cancel</CloseButton>
                  <SubmitButton disabled={inputValue === ""} type="submit">
                    Create
                  </SubmitButton>
                </Form>
              </>
            )}
          </Mutation>
        )}
      </Mutation>
    </Modal>
  );
}
