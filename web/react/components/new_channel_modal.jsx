// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

const Utils = require('../utils/utils.jsx');
var Modal = ReactBootstrap.Modal;

export default class NewChannelModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            displayNameError: ''
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.show === true && this.props.show === false) {
            this.setState({
                displayNameError: ''
            });
        }
    }
    handleSubmit(e) {
        e.preventDefault();

        const displayName = React.findDOMNode(this.refs.display_name).value.trim();
        if (displayName.length < 1) {
            this.setState({displayNameError: 'This field is required'});
            return;
        }

        this.props.onSubmitChannel();
    }
    handleChange() {
        const newData = {
            displayName: React.findDOMNode(this.refs.display_name).value,
            description: React.findDOMNode(this.refs.channel_desc).value
        };
        this.props.onDataChanged(newData);
    }
    render() {
        var displayNameError = null;
        var serverError = null;
        var displayNameClass = 'form-group';

        if (this.state.displayNameError) {
            displayNameError = <label className='control-label'>{this.state.displayNameError}</label>;
            displayNameClass += ' has-error';
        }

        if (this.props.serverError) {
            serverError = <div className='form-group has-error'><label className='control-label'>{this.props.serverError}</label></div>;
        }

        var channelTerm = '';
        var channelSwitchText = '';
        switch (this.props.channelType) {
        case 'P':
            channelTerm = 'Group';
            channelSwitchText = (
                <div>
                    {'Create a new private group with restricted membership. '}
                    <a
                        href='#'
                        onClick={this.props.onTypeSwitched}
                    >
                        {'Create a public channel'}
                    </a>
                </div>
            );
            break;
        case 'O':
            channelTerm = 'Channel';
            channelSwitchText = (
                <div>
                    {'Create a new public channel anyone can join. '}
                    <a
                        href='#'
                        onClick={this.props.onTypeSwitched}
                    >
                        {'Create a private group'}
                    </a>
                </div>
            );
            break;
        }

        const prettyTeamURL = Utils.getShortenedTeamURL();

        return (
            <span>
                <Modal
                    show={this.props.show}
                    onHide={this.props.onModalDismissed}
                >
                    <Modal.Header closeButton={true}>
                        <Modal.Title>{'New ' + channelTerm}</Modal.Title>
                    </Modal.Header>
                    <form role='form'>
                        <Modal.Body>
                            <div>
                                {channelSwitchText}
                            </div>
                            <div className={displayNameClass}>
                                <label className='control-label'>{'Name'}</label>
                                <input
                                    onChange={this.handleChange}
                                    type='text'
                                    ref='display_name'
                                    className='form-control'
                                    placeholder='Ex: "Bugs", "Marketing", "办公室恋情"'
                                    maxLength='22'
                                    value={this.props.channelData.displayName}
                                    autoFocus={true}
                                    tabIndex='1'
                                />
                                {displayNameError}
                            </div>
                            <div>
                                {'Channel URL: ' + prettyTeamURL + this.props.channelData.name + ' ('}
                                <a
                                    href='#'
                                    onClick={this.props.onChangeURLPressed}
                                >
                                    {'change this URL'}
                                </a>
                                {')'}
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>{'Description'}</label>
                                <label>{'(optional)'}</label>
                                <textarea
                                    className='form-control no-resize'
                                    ref='channel_desc'
                                    rows='3'
                                    placeholder='Description'
                                    maxLength='1024'
                                    value={this.props.channelData.description}
                                    onChange={this.handleChange}
                                    tabIndex='2'
                                />
                            </div>
                            <div>
                                {'The purpose of your channel. To help others decide whether to join.'}
                            </div>
                            {serverError}
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                type='button'
                                className='btn btn-default'
                                onClick={this.props.onModalDismissed}
                            >
                                {'Cancel'}
                            </button>
                            <button
                                onClick={this.handleSubmit}
                                type='submit'
                                className='btn btn-primary'
                                tabIndex='3'
                            >
                                {'Create New ' + channelTerm}
                            </button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </span>
        );
    }
}

NewChannelModal.defaultProps = {
    show: false,
    channelType: 'O',
    serverError: ''
};
NewChannelModal.propTypes = {
    show: React.PropTypes.bool.isRequired,
    channelType: React.PropTypes.string.isRequired,
    channelData: React.PropTypes.object.isRequired,
    serverError: React.PropTypes.string,
    onSubmitChannel: React.PropTypes.func.isRequired,
    onModalDismissed: React.PropTypes.func.isRequired,
    onTypeSwitched: React.PropTypes.func.isRequired,
    onChangeURLPressed: React.PropTypes.func.isRequired,
    onDataChanged: React.PropTypes.func.isRequired
};
