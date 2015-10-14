const UserStore = require('../stores/user_store.jsx');

var AsyncClient = require('../utils/async_client.jsx');

export default class TsTeamList extends React.Component {
    constructor(props) {
        super(props);

        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.onTeamsChange = this.onTeamsChange.bind(this);

        this.state = this.getStateFromStores();
    }

    componentDidMount() {
        UserStore.addTeamsChangeListener(this.onTeamsChange);
        AsyncClient.findTeams();
    }

    onTeamsChange() {
        let teamNames = UserStore.getTeams();

        if (teamNames.length === 1) {
            let channelPath = '/' + teamNames[0];
            window.location = channelPath;
        }

        this.setState({teamNames: teamNames});

    }

    getStateFromStores() {
        let teamNames = UserStore.getTeams();
        return {
            teamNames: teamNames
        };
    }

    render() {
        const teamNames = this.state.teamNames;

        let teamButtons = [];

        for (var i = 0; i < teamNames.length; i++) {
            let teamName = teamNames[i];
            let teamButton = (
                <p key={teamName}>
                    <a className="btn btn-primary btn-lg" href={'/' + teamName}>
                        {teamName}
                        &nbsp;<span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    </a>
                </p>
            );
            teamButtons.push(teamButton);
        }

        return (
            <div>
                <h3>Valitse tiimi:</h3>
                <div>
                    {teamButtons}
                </div>

            </div>
        );
    }
}
