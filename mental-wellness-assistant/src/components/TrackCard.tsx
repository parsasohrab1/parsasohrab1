import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { MusicTrack } from "@/types";

interface Props {
  track: MusicTrack;
}

export default function TrackCard({ track }: Props) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const onStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) setPlaying(false);
  };

  const toggle = async () => {
    if (!track.audioUrl) return;
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true },
        onStatusUpdate
      );
      soundRef.current = sound;
      setPlaying(true);
      return;
    }
    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await soundRef.current.pauseAsync();
      setPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setPlaying(true);
    }
  };

  const minutes = Math.floor(track.durationSec / 60);
  const seconds = String(track.durationSec % 60).padStart(2, "0");

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{track.title}</Text>
        <Text style={styles.artist}>
          {track.artist} · {minutes}:{seconds}
        </Text>
        {!track.audioUrl && <Text style={styles.placeholder}>نمونه صوتی متصل نیست (فقط داده)</Text>}
      </View>
      <Pressable
        onPress={toggle}
        disabled={!track.audioUrl}
        style={[styles.playButton, !track.audioUrl && styles.playButtonDisabled]}
      >
        <Text style={styles.playIcon}>{playing ? "⏸" : "▶️"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
  },
  info: { flex: 1, marginEnd: 10 },
  title: { color: "#f1f5f9", fontSize: 15, fontWeight: "600", textAlign: "right" },
  artist: { color: "#94a3b8", fontSize: 12, marginTop: 2, textAlign: "right" },
  placeholder: { color: "#64748b", fontSize: 11, marginTop: 4, textAlign: "right" },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonDisabled: { backgroundColor: "#334155" },
  playIcon: { fontSize: 18 },
});
