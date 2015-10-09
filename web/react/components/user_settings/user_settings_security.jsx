// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

var SettingItemMin = require('../setting_item_min.jsx');
var SettingItemMax = require('../setting_item_max.jsx');
var Client = require('../../utils/client.jsx');
var AsyncClient = require('../../utils/async_client.jsx');
var Constants = require('../../utils/constants.jsx');

export default class SecurityTab extends React.Component {
    constructor(props) {
        super(props);

        this.submitPassword = this.submitPassword.bind(this);
        this.updateCurrentPassword = this.updateCurrentPassword.bind(this);
        this.updateNewPassword = this.updateNewPassword.bind(this);
        this.updateConfirmPassword = this.updateConfirmPassword.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setupInitialState = this.setupInitialState.bind(this);

        this.state = this.setupInitialState();
    }
    submitPassword(e) {
        e.preventDefault();

        var user = this.props.user;
        var currentPassword = this.state.currentPassword;
        var newPassword = this.state.newPassword;
        var confirmPassword = this.state.confirmPassword;

        if (currentPassword === '') {
            this.setState({passwordError: 'Syötä nykyinen salasanasi', serverError: ''});
            return;
        }

        if (newPassword.length < 5) {
            this.setState({passwordError: 'Uuden salasanan vähimmäispituus on 5 merkkiä', serverError: ''});
            return;
        }

        if (newPassword !== confirmPassword) {
            this.setState({passwordError: 'Uudet salasanat eivät täsmää', serverError: ''});
            return;
        }

        var data = {};
        data.user_id = user.id;
        data.current_password = currentPassword;
        data.new_password = newPassword;

        Client.updatePassword(data,
            function success() {
                this.props.updateSection('');
                AsyncClient.getMe();
                this.setState(this.setupInitialState());
            }.bind(this),
            function fail(err) {
                var state = this.setupInitialState();
                if (err.message) {
                    state.serverError = err.message;
                } else {
                    state.serverError = err;
                }
                state.passwordError = '';
                this.setState(state);
            }.bind(this)
        );
    }
    updateCurrentPassword(e) {
        this.setState({currentPassword: e.target.value});
    }
    updateNewPassword(e) {
        this.setState({newPassword: e.target.value});
    }
    updateConfirmPassword(e) {
        this.setState({confirmPassword: e.target.value});
    }
    handleHistoryOpen() {
        $('#user_settings').modal('hide');
    }
    handleDevicesOpen() {
        $('#user_settings').modal('hide');
    }
    handleClose() {
        $(React.findDOMNode(this)).find('.form-control').each(function resetValue() {
            this.value = '';
        });
        this.setState({currentPassword: '', newPassword: '', confirmPassword: '', serverError: null, passwordError: null});

        this.props.updateTab('general');
    }
    setupInitialState() {
        return {currentPassword: '', newPassword: '', confirmPassword: ''};
    }
    componentDidMount() {
        $('#user_settings').on('hidden.bs.modal', this.handleClose);
    }
    componentWillUnmount() {
        $('#user_settings').off('hidden.bs.modal', this.handleClose);
        this.props.updateSection('');
    }
    render() {
        var serverError;
        if (this.state.serverError) {
            serverError = this.state.serverError;
        }
        var passwordError;
        if (this.state.passwordError) {
            passwordError = this.state.passwordError;
        }

        var updateSectionStatus;
        var passwordSection;
        if (this.props.activeSection === 'password') {
            var inputs = [];
            var submit = null;

            if (this.props.user.auth_service === '') {
                inputs.push(
                    <div
                        key='currentPasswordUpdateForm'
                        className='form-group'
                    >
                        <label className='col-sm-5 control-label'>Nykyinen salasana</label>
                        <div className='col-sm-7'>
                            <input
                                className='form-control'
                                type='password'
                                onChange={this.updateCurrentPassword}
                                value={this.state.currentPassword}
                            />
                        </div>
                    </div>
                );
                inputs.push(
                    <div
                        key='newPasswordUpdateForm'
                        className='form-group'
                    >
                        <label className='col-sm-5 control-label'>Uusi salasana</label>
                        <div className='col-sm-7'>
                            <input
                                className='form-control'
                                type='password'
                                onChange={this.updateNewPassword}
                                value={this.state.newPassword}
                            />
                        </div>
                    </div>
                );
                inputs.push(
                    <div
                        key='retypeNewPasswordUpdateForm'
                        className='form-group'
                    >
                        <label className='col-sm-5 control-label'>Uusi salasana uudestaan</label>
                        <div className='col-sm-7'>
                            <input
                                className='form-control'
                                type='password'
                                onChange={this.updateConfirmPassword}
                                value={this.state.confirmPassword}
                            />
                        </div>
                    </div>
                );

                submit = this.submitPassword;
            } else {
                inputs.push(
                    <div
                        key='oauthPasswordInfo'
                        className='form-group'
                    >
                        <label className='col-sm-12'>Log in occurs through GitLab. Please see your GitLab account settings page to update your password.</label>
                    </div>
                );
            }

            updateSectionStatus = function resetSection(e) {
                this.props.updateSection('');
                this.setState({currentPassword: '', newPassword: '', confirmPassword: '', serverError: null, passwordError: null});
                e.preventDefault();
            }.bind(this);

            passwordSection = (
                <SettingItemMax
                    title='Salasana'
                    inputs={inputs}
                    submit={submit}
                    server_error={serverError}
                    client_error={passwordError}
                    updateSection={updateSectionStatus}
                />
            );
        } else {
            var describe;
            if (this.props.user.auth_service === '') {
                var d = new Date(this.props.user.last_password_update);
                var hour = '12';
                if (d.getHours() % 12) {
                    hour = String(d.getHours() % 12);
                }
                var min = String(d.getMinutes());
                if (d.getMinutes() < 10) {
                    min = '0' + d.getMinutes();
                }
                var timeOfDay = ' am';
                if (d.getHours() >= 12) {
                    timeOfDay = ' pm';
                }

                describe = 'Viimeksi päivitetty ' + Constants.MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + hour + ':' + min + timeOfDay;
            } else {
                describe = 'Log in done through GitLab';
            }

            updateSectionStatus = function updateSection() {
                this.props.updateSection('password');
            }.bind(this);

            passwordSection = (
                <SettingItemMin
                    title='Salasana'
                    describe={describe}
                    updateSection={updateSectionStatus}
                />
            );
        }

        return (
            <div>
                <div className='modal-header'>
                    <button
                        type='button'
                        className='close'
                        data-dismiss='modal'
                        aria-label='Sulje'
                    >
                        <span aria-hidden='true'>&times;</span>
                    </button>
                    <h4
                        className='modal-title'
                        ref='title'
                    >
                        <i className='modal-back'></i>Turvallisuusasetukset
                    </h4>
                </div>
                <div className='user-settings'>
                    <h3 className='tab-header'>Turvallisuusasetukset</h3>
                    <div className='divider-dark first'/>
                    {passwordSection}
                    <div className='divider-dark'/>
                    <br></br>
                    <a
                        data-toggle='modal'
                        className='security-links theme'
                        data-target='#access-history'
                        href='#'
                        onClick={this.handleHistoryOpen}
                    >
                        <i className='fa fa-clock-o'></i>Katso käyttöhistoria
                    </a>
                    <b> </b>
                    <a
                        data-toggle='modal'
                        className='security-links theme'
                        data-target='#activity-log'
                        href='#'
                        onClick={this.handleDevicesOpen}
                    >
                        <i className='fa fa-globe'></i>Katso ja kirjaudu ulos aktiivista sessioista
                    </a>
                </div>
            </div>
        );
    }
}

SecurityTab.defaultProps = {
    user: {},
    activeSection: ''
};
SecurityTab.propTypes = {
    user: React.PropTypes.object,
    activeSection: React.PropTypes.string,
    updateSection: React.PropTypes.func,
    updateTab: React.PropTypes.func
};
