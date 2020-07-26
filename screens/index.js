import react from "react";
import { StackNavigator, DrawerNavigator } from "react-navigation";

import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";
import Chat from "./Chat";

const App = DrawerNavigator(
  {
    Home: {
      screen: Home
    },
    Profile: {
      screen: Profile
    }
  },
  {
    initialRouteName: "Home"
  }
);
const Root = StackNavigator(
  {
    App: {
      screen: App
    },
    Login: {
      screen: Login
    },
    Chat: {
      screen: Chat
    }
  },
  {
    initialRouteName: "Login",

    navigationOptions: { header: null }
  }
);

export default Root;
