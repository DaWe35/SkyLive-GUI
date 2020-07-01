module.exports = {
  channels: {
    APP_INFO: 'app_info',
    USER_WORKING_DIRECTORY: 'user_working_directory',
    UPDATE_START: 'update_start',
    UPDATE_ERROR: 'update_error',
    UPDATE_CHECKING: 'update_checking',
    UPDATE_NOT_AVAILABLE: 'update_not_available',
    UPDATE_DOWNLOADING: 'update_downloading',
    UPDATE_STATUS: 'update_status',
    UPDATE_DOWNLOADED: 'update_downloaded',
    RESTART_APP: 'restart_app',
    CREATE_RTMP_STREAM: 'create_rtmp_stream',
    CREATE_HLS_STREAM: 'create_hls_stream',
    CREATE_RESTREAM: 'create_restream',
    STREAM_STD_OUT: 'stream_std_out',
    STREAM_DATA: 'stream_data',
    CLOSE_STREAM: 'close_stream',
    CLOSE_ALL_STREAMS: 'close_all_streams',
    CLOSE_WINDOW: 'close_window',
    CONFIRM_EXIT: 'confirm_exit'
  },
  updateStates: {
    STARTED: 'started',
    CHECKING: 'checking',
    NOT_AVAILABLE: 'not_available',
    DOWNLOADING: 'downloading',
    DOWNLOADED: 'downloaded',
    ERROR: 'error'
  }
};