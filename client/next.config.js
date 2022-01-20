/*
    sometimes nextjs changes are not reflected automatically.
    the code below tells webpack that instead of trying to watch
    for file changes, it should poll all files once every 300ms
*/

//this file is loaded up automatically by nextjs whenever our project starts up
module.export = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;
        return config;
    }
};