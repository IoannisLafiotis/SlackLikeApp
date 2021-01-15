import * as React from "react";
import { omit } from 'lodash';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

export enum Actions {
  "SELECTED_CHANNEL",
  "USER",
}

const initialChannel = localStorage.getItem("selected_channel")
  ? JSON.parse(localStorage.getItem("selected_channel")!)
  : { id: "3a7c6a8c-686b-499b-9d11-c63f520b44fd", name: "general" };

const initialStoreValue = {
  selectedChannel: initialChannel,
//   user: localStorage.getItem("current_user") || "",

    user: (localStorage.getItem('current_user') &&
      JSON.parse(localStorage.getItem('current_user')!)) || {
      username: '',
      id: ''
    },
    auth0: null
};

export const StoreContext = React.createContext<Context>({
  ...initialStoreValue,
  dispatch: () => "test",
});

export interface User {
  username: string;
  id: string;
}

interface UserPayload extends User {
  auth0: Auth0Client;
}

type SelectedChannelAction = {
  type: Actions.SELECTED_CHANNEL;
  payload: { id: string; name: string; members: number };
};

type UserAction = { type: Actions.USER; payload?: UserPayload };

// type Action = { type: Actions.SELECTED_CHANNEL, payload?: any };

type Action = SelectedChannelAction | UserAction;

interface State {
  selectedChannel: {
    id: string;
    name: string;
    members: number;
    //   direct: boolean;
  };
  user: User;
    auth0: Auth0Client | null;
}

interface Context extends State {
  dispatch: (action: Action, payload?: any) => void;
}

function storeReducer(state: State, action: Action): State {
  console.log(state);
  switch (action.type) {
    case Actions.SELECTED_CHANNEL:
      return { ...state, selectedChannel: action.payload };
    case Actions.USER:
      return { ...state, user: omit(action.payload, ["auth0"]), auth0: Object.assign({}, action!.payload!.auth0 ) };
    default:
      throw new Error();
  }
}

interface Props {
  children: React.ReactNode;
    user: UserPayload | null;
}

export function StoreContextProvider(props: Props) {
  const [store, dispatch] = React.useReducer(storeReducer, initialStoreValue);
  React.useEffect(() => {
    localStorage.setItem(
      "selected_channel",
      JSON.stringify(store.selectedChannel)
    );
  }, [store.selectedChannel]);

  React.useEffect(() => {
     
    //   const value = prompt("Select a user!!");
      if (props.user) {
        dispatch({ type: Actions.USER, payload: props.user });
      
        localStorage.setItem("current_user", JSON.stringify(omit(props.user, ["auth0"])));
      }
    
  }, [props.user]);
  return (
    <StoreContext.Provider value={{ ...store, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  );
}
