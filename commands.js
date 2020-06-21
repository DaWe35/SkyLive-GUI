function getHlsStreamArguments(token, dir) {
    return ["-t",token,"-d",dir];
}

function getRtmpStreamArguments(token) {
    return ["-t",token];
}

function getRestreamArguments(token, url) {
    return ["-t",token,"-u",url];
}

module.exports = {
    getHlsStreamArguments, getRtmpStreamArguments, getRestreamArguments
}