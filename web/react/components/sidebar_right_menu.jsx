// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

var UserStore = require('../stores/user_store.jsx');
var client = require('../utils/client.jsx');
var utils = require('../utils/utils.jsx');

export default class SidebarRightMenu extends React.Component {
    componentDidMount() {
        $('.sidebar--left .dropdown-menu').perfectScrollbar();
    }

    constructor(props) {
        super(props);

        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    handleLogoutClick(e) {
        e.preventDefault();
        client.logout();
    }

    render() {
        var teamLink = '';
        var inviteLink = '';
        var teamSettingsLink = '';
        var manageLink = '';
        var consoleLink = '';
        var currentUser = UserStore.getCurrentUser();
        var isAdmin = false;
        var isSystemAdmin = false;

        if (currentUser != null) {
            isAdmin = utils.isAdmin(currentUser.roles);
            isSystemAdmin = utils.isSystemAdmin(currentUser.roles);

            inviteLink = (
                <li>
                    <a href='#'
                        data-toggle='modal'
                        data-target='#invite_member'
                    ><i className='glyphicon glyphicon-user'></i>Kutsu uusi jäsen</a>
                </li>
            );

            if (this.props.teamType === 'O') {
                teamLink = (
                    <li>
                        <a href='#'
                            data-toggle='modal'
                            data-target='#get_link'
                            data-title='Team Invite'
                            data-value={utils.getWindowLocationOrigin() + '/signup_user_complete/?id=' + currentUser.team_id}
                        ><i className='glyphicon glyphicon-link'></i>Hae tiimikutsulinkki</a>
                    </li>
                );
            }
        }

        if (isAdmin) {
            teamSettingsLink = (
                <li>
                    <a
                        href='#'
                        data-toggle='modal'
                        data-target='#team_settings'
                    ><i className='glyphicon glyphicon-globe'></i>Tiimiasetukset</a>
                </li>
            );
            manageLink = (
                <li>
                    <a
                        href='#'
                        data-toggle='modal'
                        data-target='#team_members'
                    >
                    <i className='glyphicon glyphicon-wrench'></i>Hallinnoi tiimiä</a>
                </li>
            );
        }

        if (isSystemAdmin) {
            consoleLink = (
                <li>
                    <a
                        href='/admin_console'
                    >
                    <i className='glyphicon glyphicon-wrench'></i>Järjestelmäkonsoli</a>
                </li>
            );
        }

        var siteName = '';
        if (global.window.config.SiteName != null) {
            siteName = global.window.config.SiteName;
        }
        var teamDisplayName = siteName;
        if (this.props.teamDisplayName) {
            teamDisplayName = this.props.teamDisplayName;
        }

        return (
            <div>
                <div className='team__header theme'>
                    <a
                        className='team__name'
                        href='/channels/town-square'
                    >{teamDisplayName}</a>
                </div>

                <div className='nav-pills__container'>
                    <ul className='nav nav-pills nav-stacked'>
                        <li>
                            <a
                                href='#'
                                data-toggle='modal'
                                data-target='#user_settings'
                            ><i className='glyphicon glyphicon-cog'></i>Tilin asetukset</a></li>
                        {teamSettingsLink}
                        {inviteLink}
                        {teamLink}
                        {manageLink}
                        {consoleLink}
                        <li>
                            <a
                                href='#'
                                onClick={this.handleLogoutClick}
                            ><i className='glyphicon glyphicon-log-out'></i>Kirjaudu ulos</a></li>
                        <li className='divider'></li>
                        <li>
                            <a
                                target='_blank'
                                href='/static/help/configure_links.html'
                            ><i className='glyphicon glyphicon-question-sign'></i>Ohjeet</a></li>
                        <li>
                            <a
                                target='_blank'
                                href='/static/help/configure_links.html'
                            ><i className='glyphicon glyphicon-earphone'></i>Ilmoita ongelmasta</a></li>
                    </ul>
                </div>
            </div>
        );
    }
}

SidebarRightMenu.propTypes = {
    teamType: React.PropTypes.string,
    teamDisplayName: React.PropTypes.string
};
