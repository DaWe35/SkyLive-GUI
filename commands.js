function getHlsStreamArguments(token, dir) {
    return ["-t",token,"-d",dir];
}

function getRtmpStreamArguments(token) {
    return ["-t",token];
}

// In order to specify arguments to multiple processes, specify an object, with keys labelled the same as keys on "platformBinaries"
function getRestreamArguments(token, url) {
    return {processOne: ["-t",token,"-u",url, "-desc","processONE"], processTwo: ["-t",token,"-u",url, "-desc","processTWO"]};
}

module.exports = {
    getHlsStreamArguments, getRtmpStreamArguments, getRestreamArguments
}