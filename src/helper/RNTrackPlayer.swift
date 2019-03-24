//
//  RNTrackPlayer.swift
//  RNTrackPlayer
//
//  Created by David Chavez on 13.08.17.
//  Copyright © 2017 David Chavez. All rights reserved.
//

import Foundation
import MediaPlayer
import AVFoundation

@objc(RNTrackPlayer)
class RNTrackPlayer: RCTEventEmitter, MediaWrapperDelegate {
    private lazy var mediaWrapper: MediaWrapper = {
        let wrapper = MediaWrapper()
        wrapper.delegate = self
        
        return wrapper
    }()
    
    // MARK: - MediaWrapperDelegate Methods
    
    func playerUpdatedState() {
        sendEvent(withName: "playback-state", body: mediaWrapper.state)
    }
    
    func playerSwitchedTracks(trackId: String?) {
        sendEvent(withName: "playback-track-changed", body: trackId)
    }
    
    func playerTrackEnded(trackId: String?, time: TimeInterval?) {
        guard let trackId = trackId, let time = time else { return }
        sendEvent(withName: "playback-track-ended", body: ["trackId": trackId, "position": time])
    }
    
    func playerExhaustedQueue() {
        sendEvent(withName: "playback-ended", body: nil)
    }
    
    func playbackFailed(error: Error) {
        sendEvent(withName: "playback-error", body: error.localizedDescription)
    }
    
    func playbackUpdatedProgress(to time: TimeInterval) {
        sendEvent(withName: "playback-progress", body: mediaWrapper.currentTrackProgression)
    }
    
    
    // MARK: - Required Methods
    
    @objc(constantsToExport)
    override func constantsToExport() -> [String: Any] {
        return [
            "STATE_NONE": AudioPlayerState.stopped,
            "STATE_PLAYING": AudioPlayerState.playing,
            "STATE_PAUSED": AudioPlayerState.paused,
            "STATE_STOPPED": AudioPlayerState.stopped,
            "STATE_BUFFERING": AudioPlayerState.buffering,
            
            "CAPABILITY_PLAY": Capability.play,
            "CAPABILITY_PAUSE": Capability.pause,
            "CAPABILITY_STOP": Capability.stop,
            "CAPABILITY_SKIP_TO_NEXT": Capability.next,
            "CAPABILITY_SKIP_TO_PREVIOUS": Capability.previous,
            "CAPABILITY_SEEK_TO": Capability.seekTo
        ]
    }
    
    @objc(supportedEvents)
    override func supportedEvents() -> [String] {
        return [
            "playback-ended",
            "playback-state",
            "playback-error",
            "playback-progress",
            "playback-track-ended",
            "playback-track-changed",
            
            "remote-stop",
            "remote-pause",
            "remote-play",
            "remote-next",
            "remote-previous",
            "remote-seek-forward",
            "remote-seek-backward"
            
        ]
    }
    
    
    // MARK: - Bridged Methods
    
    @objc(setupPlayer:resolver:rejecter:)
    func setupPlayer(config: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            try AVAudioSession.sharedInstance().setCategory(AVAudioSessionCategoryPlayback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            reject("setup_audio_session_failed", "Failed to setup audio session", error)
        }
        
        resolve(NSNull())
    }
    
    @objc(destroy)
    func destroy() {
        print("Destroying player")
    }
    
    @objc(updateOptions:)
    func update(options: [String: Any]) {
        let remoteCenter = MPRemoteCommandCenter.shared()
        let capabilities = options["capabilities"] as? [Capability] ?? []
        
        //        let enableStop = capabilities.contains(.stop)
        //        let enablePause = capabilities.contains(.pause)
        //        let enablePlay = capabilities.contains(.play)
        //        let enablePlayNext = capabilities.contains(.next)
        //        let enablePlayPrevious = capabilities.contains(.previous)
        
        let enableStop = true
        let enablePause = true
        let enablePlay = true
        let enablePlayNext = true
        let enablePlayPrevious = true
        let enableSeekTo = true
        
        toggleRemoteHandler(command: remoteCenter.stopCommand, selector: #selector(remoteSentStop), enabled: enableStop)
        toggleRemoteHandler(command: remoteCenter.pauseCommand, selector: #selector(remoteSentPause), enabled: enablePause)
        toggleRemoteHandler(command: remoteCenter.playCommand, selector: #selector(remoteSentPlay), enabled: enablePlay)
        toggleRemoteHandler(command: remoteCenter.togglePlayPauseCommand, selector: #selector(remoteSentPlayPause), enabled: enablePause && enablePlay)
        toggleRemoteHandler(command: remoteCenter.nextTrackCommand, selector: #selector(remoteSentNext), enabled: enablePlayNext)
        toggleRemoteHandler(command: remoteCenter.previousTrackCommand, selector: #selector(remoteSentPrevious), enabled: enablePlayPrevious)
        if #available(iOS 9.1, *) {
            toggleRemoteHandler(command: remoteCenter.changePlaybackPositionCommand, selector: #selector(remoteSeekForward(event:)), enabled: enableSeekTo)
        } else {
            // Fallback on earlier versions
        }
        
        toggleRemoteHandler(command: remoteCenter.seekBackwardCommand, selector: #selector(remoteSeekBackward), enabled: enableSeekTo)
        
    }
    
    @objc(add:before:resolver:rejecter:)
    func add(trackDicts: [[String: Any]], before trackId: String?, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let trackId = trackId, !mediaWrapper.queueContainsTrack(trackId: trackId) {
            reject("track_not_in_queue", "Given track ID was not found in queue", nil)
            return
        }
        
        var tracks = [Track]()
        for trackDict in trackDicts {
            guard let track = Track(dictionary: trackDict) else {
                reject("invalid_track_object", "Track is missing a required key", nil)
                return
            }
            
            tracks.append(track)
        }
        
        print("Adding tracks:", tracks)
        mediaWrapper.addTracks(tracks, before: trackId)
        resolve(NSNull())
    }
    
    @objc(remove:resolver:rejecter:)
    func remove(tracks ids: [String], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Removing tracks:", ids)
        mediaWrapper.removeTracks(ids: ids)
        
        resolve(NSNull())
    }
    
    @objc(skip:resolver:rejecter:)
    func skip(to trackId: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if !mediaWrapper.queueContainsTrack(trackId: trackId) {
            reject("track_not_in_queue", "Given track ID was not found in queue", nil)
            return
        }
        
        print("Skipping to track:", trackId)
        mediaWrapper.skipToTrack(id: trackId)
        resolve(NSNull())
    }
    
    @objc(skipToNext:rejecter:)
    func skipToNext(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Skipping to next track")
        if (mediaWrapper.playNext()) {
            resolve(NSNull())
        } else {
            reject("queue_exhausted", "There is no tracks left to play", nil)
        }
    }
    
    @objc(skipToPrevious:rejecter:)
    func skipToPrevious(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Skipping to next track")
        if (mediaWrapper.playPrevious()) {
            resolve(NSNull())
        } else {
            reject("no_previous_track", "There is no previous track", nil)
        }
    }
    
    @objc(reset)
    func reset() {
        print("Resetting player.")
        mediaWrapper.reset()
    }
    
    @objc(play)
    func play() {
        print("Starting/Resuming playback")
        mediaWrapper.play()
    }
    
    @objc(pause)
    func pause() {
        print("Pausing playback")
        mediaWrapper.pause()
    }
    
    @objc(stop)
    func stop() {
        print("Stopping playback")
        mediaWrapper.stop()
    }
    
    @objc(seekTo:)
    func seek(to time: Double) {
        print("Seeking to \(time) seconds")
        mediaWrapper.seek(to: time)
    }
    
    @objc(setVolume:)
    func setVolume(level: Float) {
        print("Setting volume to \(level)")
        mediaWrapper.volume = level
    }
    
    @objc(getTrack:resolver:rejecter:)
    func getTrack(id: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if !mediaWrapper.queueContainsTrack(trackId: id) {
            reject("track_not_in_queue", "Given track ID was not found in queue", nil)
            return
        }
        
        resolve(mediaWrapper.currentTrack!.toObject())
    }
    
    @objc(getCurrentTrack:rejecter:)
    func getCurrentTrack(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let currentTrack = mediaWrapper.currentTrack else {
            reject("no_track_playing", "There is no track playing", nil)
            return
        }
        
        resolve(currentTrack.id)
    }
    
    @objc(getDuration:rejecter:)
    func getDuration(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(mediaWrapper.currentTrackDuration)
    }
    
    @objc(getBufferedPosition:rejecter:)
    func getBufferedPosition(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(mediaWrapper.bufferedPosition)
    }
    
    @objc(getPosition:rejecter:)
    func getPosition(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(mediaWrapper.currentTrackProgression)
    }
    
    @objc(getState:rejecter:)
    func getState(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(mediaWrapper.state)
    }
    
    
    // MARK: - Private Helpers
    
    private func toggleRemoteHandler(command: MPRemoteCommand, selector: Selector, enabled: Bool) {
        if( !enabled ) { return }
        command.removeTarget(self, action: selector)
        command.addTarget(self, action: selector)
        command.isEnabled = enabled
    }
    
    
    // MARK: - Remote Dynamic Methods
    
    func remoteSentStop() {
        sendEvent(withName: "remote-stop", body: nil)
    }
    
    func remoteSentPause() {
        sendEvent(withName: "remote-pause", body: nil)
    }
    
    func remoteSentPlay() {
        sendEvent(withName: "remote-play", body: nil)
    }
    
    func remoteSentNext() {
        sendEvent(withName: "remote-next", body: nil)
    }
    
    func remoteSentPrevious() {
        sendEvent(withName: "remote-previous", body: nil)
    }
    
    func remoteSeekForward(event: MPChangePlaybackPositionCommandEvent) {
        sendEvent(withName: "remote-seek-forward", body: event.positionTime)
    }
    
    func remoteSeekBackward() {
        sendEvent(withName: "remote-seek-backward", body: nil)
    }
    
    func remoteSentPlayPause() {
        if mediaWrapper.state == "STATE_PAUSED" {
            sendEvent(withName: "remote-play", body: nil)
            return
        }
        
        sendEvent(withName: "remote-pause", body: nil)
    }
}

