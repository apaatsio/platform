const TsTeamList = require('./ts_team_list.jsx');
const TsLogin = require('./ts_login.jsx');

const UserStore = require('../stores/user_store.jsx');

export default class TsMain extends React.Component {
    constructor(props) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.onUserStoreChange = this.onUserStoreChange.bind(this);

        this.state = this.getInitialState();
    }

    componentDidMount() {
        console.log("componentDidMount");
        UserStore.addChangeListener(this.onUserStoreChange);
    }

    onUserStoreChange() {
        console.log("onUserStoreChange", arguments);
        this.setState(this.getStateFromStores());
    }

    getInitialState() {
        let currentUser = UserStore.getCurrentUserForceSync();
        let isLoggedIn = currentUser !== null;
        console.log("getInitialState, currentUser", currentUser);
        console.log("getInitialState, isLoggedIn", isLoggedIn);
        return {
            user: currentUser,
            isLoggedIn: isLoggedIn
        };
    }

    getStateFromStores() {
        let currentUser = UserStore.getCurrentUser();
        //let currentUser = UserStore.getCurrentUserForceSync();
        let isLoggedIn = currentUser !== null;
        return {
            user: currentUser,
            isLoggedIn: isLoggedIn
        };
    }

    updateState() {
        this.setState(this.getStateFromStores());
    }

    render() {
        if (this.state.isLoggedIn) {
            return <TsTeamList />
        } else {
            return <TsLogin />
        }
    }
}
