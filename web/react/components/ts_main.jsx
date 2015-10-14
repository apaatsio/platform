const TsTeamList = require('./ts_team_list.jsx');
const TsLogin = require('./ts_login.jsx');

const UserStore = require('../stores/user_store.jsx');

export default class TsMain extends React.Component {
    constructor(props) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.getInitialStateFromStore = this.getInitialStateFromStore.bind(this);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.onUserStoreChange = this.onUserStoreChange.bind(this);

        this.state = this.getInitialStateFromStore();
    }

    componentDidMount() {
        UserStore.addChangeListener(this.onUserStoreChange);
    }

    onUserStoreChange() {
        this.setState(this.getStateFromStores());
    }

    getInitialStateFromStore() {
        let currentUser = UserStore.getCurrentUserForceSync();
        let isLoggedIn = currentUser !== null;
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
