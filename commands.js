function getHlsStreamArguments(token, dir) {
    return ["--token",token,"--record_folder",dir];
}

function getRtmpStreamArguments(token) {
    return ["--token",token];
}

// In order to specify arguments to multiple processes, specify an object, with keys labelled the same as keys on "platformBinaries"
function getRestreamArguments(token, url) {
    return {processOne: ["--token",token, "--record_folder","temp_restream_0"], processTwo: ["--url",url]};
}

module.exports = {
    getHlsStreamArguments, getRtmpStreamArguments, getRestreamArguments
}