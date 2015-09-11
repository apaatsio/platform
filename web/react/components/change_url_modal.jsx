// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

var Modal = ReactBootstrap.Modal;
var Utils = require('../utils/utils.jsx');

export default class ChangeUrlModal extends React.Component {
    constructor(props) {
        super(props);

        this.onURLChanged = this.onURLChanged.bind(this);
        this.doSubmit = this.doSubmit.bind(this);
        this.doCancel = this.doCancel.bind(this);

        this.state = {
            currentURL: props.currentURL,
            urlError: '',
            userEdit: false
        };
    }
    componentWillReceiveProps(nextProps) {
        // This check prevents the url being deleted when we re-render
        // because of user status check
        if (!this.state.userEdit) {
            this.setState({
                currentURL: nextProps.currentURL
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.show === true && prevProps.show === false) {
            React.findDOMNode(this.refs.urlinput).select();
        }
    }
    onURLChanged(e) {
        const url = e.target.value.trim();
        this.setState({currentURL: url.replace(/[^A-Za-z0-9-_]/g, '').toLowerCase(), userEdit: true});
    }
    getURLError(url) {
        let error = []; //eslint-disable-line prefer-const
        if (url.length < 2) {
            error.push(<span key='error1'>{'Must be longer than two characters'}<br/></span>);
        }
        if (url.charAt(0) === '-' || url.charAt(0) === '_') {
            error.push(<span key='error2'>{'Must start with a letter or number'}<br/></span>);
        }
        if (url.length > 1 && (url.charAt(url.length - 1) === '-' || url.charAt(url.length - 1) === '_')) {
            error.push(<span key='error3'>{'Must end with a letter or number'}<br/></span>);
        }
        if (url.indexOf('__') > -1) {
            error.push(<span key='error4'>{'Can not contain two underscores in a row.'}<br/></span>);
        }

        // In case of error we don't detect
        if (error.length === 0) {
            error.push(<span key='errorlast'>{'Invalid URL'}<br/></span>);
        }
        return error;
    }
    doSubmit(e) {
        e.preventDefault();

        const url = React.findDOMNode(this.refs.urlinput).value;
        const cleanedURL = Utils.cleanUpUrlable(url);
        if (cleanedURL !== url || url.length < 2 || url.indexOf('__') > -1) {
            this.setState({urlError: this.getURLError(url)});
            return;
        }
        this.setState({urlError: '', userEdit: false});
        this.props.onModalSubmit(url);
    }
    doCancel() {
        this.setState({urlError: '', userEdit: false});
        this.props.onModalDismissed();
    }
    render() {
        let urlClass = 'form-group input-group input-group--limit';
        let urlError = null;
        let serverError = null;

        if (this.state.urlError) {
            urlClass += ' has-error';
            urlError = (<label className='control-label'>{this.state.urlError}</label>);
        }

        if (this.props.serverError) {
            serverError = <div className='form-group has-error'><label className='control-label'>{this.props.serverError}</label></div>;
        }

        const teamURL = Utils.getShortenedTeamURL();

        return (
            <Modal
                show={this.props.show}
                onHide={this.doCancel}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <form role='form'>
                    <Modal.Body>
                        <div>
                            {this.props.description}
                        </div>
                        <div className={urlClass}>
                            <label className='control-label'>{this.props.urlLabel}</label>
                            <span
                                data-toggle='tooltip'
                                title={teamURL}
                                className='input-group-addon'
                            >
                                {teamURL}
                            </span>
                            <input
                                type='text'
                                ref='urlinput'
                                className='form-control'
                                maxLength='22'
                                onChange={this.onURLChanged}
                                value={this.state.currentURL}
                                autoFocus={true}
                                tabIndex='1'
                            />
                            {urlError}
                        </div>
                        {serverError}
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type='button'
                            className='btn btn-default'
                            onClick={this.doCancel}
                        >
                            {'Close'}
                        </button>
                        <button
                            onClick={this.doSubmit}
                            type='submit'
                            className='btn btn-primary'
                            tabIndex='2'
                        >
                            {this.props.submitButtonText}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

ChangeUrlModal.defaultProps = {
    show: false,
    title: 'Change URL',
    desciption: '',
    urlLabel: 'URL',
    submitButtonText: 'Submit',
    currentURL: '',
    serverError: ''
};

ChangeUrlModal.propTypes = {
    show: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    urlLabel: React.PropTypes.string,
    submitButtonText: React.PropTypes.string,
    currentURL: React.PropTypes.string,
    serverError: React.PropTypes.string,
    onModalSubmit: React.PropTypes.func.isRequired,
    onModalDismissed: React.PropTypes.func.isRequired
};
