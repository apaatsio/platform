// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

export default class ViewImagePopoverBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var publicLink = '';
        if (global.window.config.EnablePublicLink === 'true') {
            publicLink = (
                <div>
                    <a
                        href='#'
                        className='public-link text'
                        data-title='Julkinen kuva'
                        onClick={this.getPublicLink}
                    >
                        {'Näytä julkinen linkki'}
                    </a>
                    <span className='text'>{' | '}</span>
                </div>
            );
        }

        var footerClass = 'modal-button-bar';
        if (this.props.show) {
            footerClass += ' footer--show';
        }

        return (
            <div
                ref='imageFooter'
                className={footerClass}
            >
                <span className='pull-left text'>{'Tiedosto ' + (this.props.fileId + 1) + '/' + this.props.totalFiles}</span>
                <div className='image-links'>
                    {publicLink}
                    <a
                        href={this.props.fileURL}
                        download={this.props.filename}
                        className='text'
                    >
                        {'Lataa'}
                    </a>
                </div>
            </div>
        );
    }
}
ViewImagePopoverBar.defaultProps = {
    show: false,
    imgId: 0,
    totalFiles: 0,
    filename: '',
    fileURL: ''
};

ViewImagePopoverBar.propTypes = {
    show: React.PropTypes.bool.isRequired,
    fileId: React.PropTypes.number.isRequired,
    totalFiles: React.PropTypes.number.isRequired,
    filename: React.PropTypes.string.isRequired,
    fileURL: React.PropTypes.string.isRequired,
    onGetPublicLinkPressed: React.PropTypes.func.isRequired
};
