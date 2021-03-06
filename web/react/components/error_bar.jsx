// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

var ErrorStore = require('../stores/error_store.jsx');

export default class ErrorBar extends React.Component {
    constructor() {
        super();

        this.onErrorChange = this.onErrorChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.prevTimer = null;

        this.state = ErrorStore.getLastError();
        if (this.isValidError(this.state)) {
            this.prevTimer = setTimeout(this.handleClose, 10000);
        }
    }

    isValidError(s) {
        if (!s) {
            return false;
        }

        if (!s.message) {
            return false;
        }

        if (s.connErrorCount && s.connErrorCount >= 1 && s.connErrorCount < 7) {
            return false;
        }

        return true;
    }

    isConnectionError(s) {
        if (!s.connErrorCount || s.connErrorCount === 0) {
            return false;
        }

        if (s.connErrorCount > 7) {
            return true;
        }

        return false;
    }

    componentDidMount() {
        ErrorStore.addChangeListener(this.onErrorChange);
    }

    componentWillUnmount() {
        ErrorStore.removeChangeListener(this.onErrorChange);
    }

    onErrorChange() {
        var newState = ErrorStore.getLastError();

        if (this.prevTimer != null) {
            clearInterval(this.prevTimer);
            this.prevTimer = null;
        }

        if (newState) {
            this.setState(newState);
            if (!this.isConnectionError(newState)) {
                this.prevTimer = setTimeout(this.handleClose, 10000);
            }
        } else {
            this.setState({message: null});
        }
    }

    handleClose(e) {
        if (e) {
            e.preventDefault();
        }

        this.setState({message: null});
    }

    render() {
        if (!this.isValidError(this.state)) {
            return <div/>;
        }

        return (
            <div className='error-bar'>
                <span>{this.state.message}</span>
                <a
                    href='#'
                    className='error-bar__close'
                    onClick={this.handleClose}
                >
                    &times;
                </a>
            </div>
        );
    }
}
