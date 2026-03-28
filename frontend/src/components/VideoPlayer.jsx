import { useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize } from 'react-icons/fi'

const VideoPlayer = ({ url, onProgress, lectureId }) => {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [ready, setReady] = useState(false)
  const playerRef = useRef(null)

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleProgress = (state) => {
    setPlayed(state.played)
    if (onProgress) onProgress(state)
    if (state.played > 0.9 && lectureId) {
      // mark as complete
    }
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    playerRef.current?.seekTo(x)
  }

  if (!url) {
    return (
      <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
        <div className="text-center">
          <FiPlay className="text-gray-600 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">No video available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-black rounded-xl overflow-hidden group">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        muted={muted}
        volume={volume}
        onProgress={handleProgress}
        onDuration={setDuration}
        onReady={() => setReady(true)}
        width="100%"
        height="100%"
        className="aspect-video"
        config={{
          file: { attributes: { controlsList: 'nodownload', disablePictureInPicture: false } }
        }}
      />
      {/* Custom controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress bar */}
        <div
          className="w-full h-1.5 bg-gray-600 rounded-full mb-3 cursor-pointer hover:h-2.5 transition-all"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-blue-500 rounded-full relative"
            style={{ width: `${played * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow" />
          </div>
        </div>
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlaying(p => !p)}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {playing ? <FiPause size={20} /> : <FiPlay size={20} />}
            </button>
            <button
              onClick={() => setMuted(m => !m)}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {muted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={e => { setVolume(Number(e.target.value)); setMuted(false) }}
              className="w-20 accent-blue-500"
            />
            <span className="text-xs text-gray-300">
              {formatTime(played * duration)} / {formatTime(duration)}
            </span>
          </div>
          <button
            onClick={() => playerRef.current?.getInternalPlayer()?.requestFullscreen?.()}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <FiMaximize size={18} />
          </button>
        </div>
      </div>
      {/* Click to play/pause */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setPlaying(p => !p)}
        style={{ bottom: '60px' }}
      />
      {!playing && ready && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ bottom: '60px' }}>
          <div className="w-16 h-16 bg-blue-600/80 rounded-full flex items-center justify-center shadow-lg">
            <FiPlay className="text-white text-2xl ml-1" />
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
