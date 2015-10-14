var TsMain = require('../components/ts_main.jsx');

function setupTsMainPage() {
    React.render(
        <TsMain />,
        document.getElementById('ts-main')
    );
}

global.window.setup_ts_main_page = setupTsMainPage;
