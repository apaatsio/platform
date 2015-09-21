// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

var Login = require('../components/login.jsx');
var IntlProvider = require('react-intl').IntlProvider;

var locale = window.i18n.locale;
var messages = window.i18n.messages;

function setupLoginPage(props) {
    React.render(
        <IntlProvider locale={locale} messages={messages}>
            {() =>
                <Login
                    teamDisplayName={props.TeamDisplayName}
                    teamName={props.TeamName}
                    authServices={props.AuthServices}
                />
            }
        </IntlProvider>,
        document.getElementById('login')
    );
}

global.window.setup_login_page = setupLoginPage;
