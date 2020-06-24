function getHlsStreamArguments(token, dir) {
    return ["--token",token,"--record_folder",dir];
}

function getRtmpStreamArguments(token) {
    return ["--token",token];
}

// In order to specify arguments to multiple processes, specify an object, with keys labelled the same as keys on "platformBinaries"
function getRestreamArguments(token, url) {
    return {uploader: ["--token",token, "--record_folder",token], downloader: ["--url",url, "--record_folder",token]};
}

module.exports = {
    getHlsStreamArguments, getRtmpStreamArguments, getRestreamArguments
}