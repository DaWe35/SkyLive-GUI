function getHlsStreamArguments(token, dir, keepFiles) {
    return ["--token",token,"--record_folder",dir, "--keep_files",keepFiles];
}

function getRtmpStreamArguments(token) {
    return ["--token",token];
}

// In order to specify arguments to multiple processes, specify an object, with keys labelled the same as keys on "platformBinaries"
function getRestreamArguments(token, url, keepFiles) {
    return {uploader: ["--token",token, "--record_folder",token, "--keep_files",keepFiles], downloader: ["--url",url, "--record_folder",token]};
}

function getDownloadUploadArguments(token, url, keepFiles) {
    return ["--token",token,"--ulr",url, "--keep_files",keepFiles];
}

module.exports = {
    getHlsStreamArguments, getRtmpStreamArguments, getRestreamArguments, getDownloadUploadArguments
}